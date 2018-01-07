import models
import constants
import math
from google.appengine.ext import ndb


def get_income_bracket(income):
    if income < 1000:
        return 0.4
    elif income < 2500:
        return 0.9
    elif income < 3500:
        return 1.4
    elif income < 6000:
        return 1.7
    elif income < 12000:
        return 2.3
    elif income < 20000:
        return 2.7
    else:
        return 3


def get_wealth_bracket(wealth):
    if wealth < 50000:
        return 0.3
    elif wealth < 450000:
        return 0.6
    elif wealth < 800000:
        return 0.9
    elif wealth < 1500000:
        return 1.2
    elif wealth < 2500000:
        return 1.5
    elif wealth < 5000000:
        return 1.8
    else:
        return 2


def calc_balance(user):
    expenditure = sum([i.value for i in user.all_expenditure])
    periodic_spending = sum([i.value for i in user.periodic_spending])
    return user.balance + user.total_passive_income - periodic_spending - expenditure


def calc_passive_income(user):
    total = 0
    for investment in user.all_investments:
        if investment.type == "Bond":
            total += ((investment.interest / investment.period) * (constants.MONTH_DAYS))
    passive_income = [(i.passive_income / i.period) * (constants.MONTH_DAYS) for i in user.assets]
    return total + sum(passive_income)


def calc_net_worth(user):
    assets = sum([i.value for i in user.assets])
    balance = user.balance
    investments = user.all_investments
    total = assets + balance
    for i in investments:
        if i.type == "Bond":
            total += i.value
        else:
            total += i.value * i.qty
    return total


def calc_periodic_spending(user):
    periodic_spending = [(i.value / i.period) * (constants.MONTH_DAYS) for i in user.periodic_spending]
    return sum(periodic_spending)


def calc_risk_factor(user):
    assets = sum([i.value for i in user.assets])
    expenditure = sum([i.value for i in user.all_expenditure])
    investments = user.all_investments
    stable_income = user.calculated_balance + assets
    unstable_income = 0
    for i in investments:
        if i.type == "Bond":
            stable_income += i.value
        else:
            unstable_income += i.value * i.qty
    risk = 0
    risk += math.log1p(100 - user.age) / 4
    risk += get_income_bracket(user.income)
    if not user.is_income_stable:
        risk -= 1.5
    risk += (unstable_income / (stable_income + 1)) * 4
    risk += get_wealth_bracket(user.net_worth)
    risk += (1 - expenditure / user.income) * 2
    return risk


def calc_recommended_savings(user):
    goals = sum([i.value for i in user.all_goals]) * 3
    const = 0
    const += get_wealth_bracket(user.net_worth)
    const += get_income_bracket(user.income) * (3 / 2)
    const += user.risk_factor / 5
    const += get_wealth_bracket(goals)
    const += constants.LAST_MONTHS_EXPENDITURE / (user.income + 1)
    return const ** 2



def calc_insurance_coverage(user):
    weights = {"Pet Insurance": 1, "Travel Insurance": 2, "Private Medical and Dental Insurance": 3, "Car Insurance": 4,
               "Critical Illness": 5, "Home Insurance": 6, "Life Insurance": 7}
    weight = 0
    types = []
    for i in user.all_insurances:
        if i.type not in types:
            weight += weights[i.type]
            types += i.type
    return float(weight / 28 * 100)


def get_pie():
    types = {"Food and Drink": 0, "Bills and Utilities": 0, "Clothing and Cosmetics": 0, "Transportation": 0,
             "Health/Medical": 0, "Hobbies/Enjoyment": 0, "Misc": 0}
    users = models.User.query().fetch()
    user = users[0]
    for i in user.all_expenditure:
        types[i.type] += i.value
    total = sum(types.values())
    result = []
    for k, v in types.items():
        result.append(models.BudgetMessage(type=k, percentage=v / total * 100))
    return result


def get_advice():
    advices = []
    users = models.User.query().fetch()
    user = users[0]
    goals = user.all_goals
    budget_template = {"Food and Drink": 20, "Bills and Utilities": 7, "Clothing and Cosmetics": 10,
                       "Transportation": 15,
                       "Health/Medical": 15, "Hobbies/Enjoyment": 5, "Misc": 100}
    budget_goal = {"Food and Drink": 0, "Bills and Utilities": 0, "Clothing and Cosmetics": 0, "Transportation": 0,
                   "Health/Medical": 0, "Hobbies/Enjoyment": 0, "Misc": 0}
    for i in user.budget:
        budget_goal[i.type] = i.percentage
    budget_actual = {"Food and Drink": 0, "Bills and Utilities": 0, "Clothing and Cosmetics": 0, "Transportation": 0,
                     "Health/Medical": 0, "Hobbies/Enjoyment": 0, "Misc": 0}
    for i in user.all_expenditure:
        budget_actual[i.type] += i.value
    available_insurance = [i.type for i in user.all_insurances]
    possesions = [i.name for i in user.all_goals if i.is_achieved == True]
    if user.balance < (constants.LAST_MONTHS_EXPENDITURE * 6):
        advices.append(["Emergency Savings",
                        "Your account balance is insufficient for six months of expenses. You may want to keep some spare cash for emergencies."])
    if len(goals) == 0:
        advices.append(["Goals",
                        "It is good to set some personal goals in order to have something to aim towards. Add some goals from the Goals page!"])
    elif len(goals) > 20:
        advices.append(
            ["Goals", "Seems like you have quite a few goals. Perhaps you may want to focus on a few key ones?"])
    if sum([i.value for i in goals]) / len(goals) < 1000:
        advices.append(["Goals",
                        "It might be a good idea to set some larger goals to have something more substantial to work towards."])
    elif sum([i.value for i in goals]) / len(goals) > 50000:
        advices.append(["Goals", "It might be a good idea to set some smaller goals to work towards in the short term."])
    if min([i.value for i in user.all_goals]) < (user.calculated_balance * 3 / 2):
        advices.append(
            ["Goals", "You have enough to complete a goal! Consider carefully before making the final decision."])
    if user.desired_saving < 1 and user.income > 1000:
        advices.append(["Savings", "You might want to put a larger portion of your income into savings."])
    elif (100 - user.desired_saving) * user.income < 1000:
        advices.append(["Savings", "While saving is desirable, also make sure to set aside enough for daily expenses!"])
    elif user.desired_saving < user.recommended_savings:
        advices.append(["Savings",
                        "Based on our calculations, you may want to increase your savings to about %s%% of your income." % (
                        str(round(user.recommended_savings, 1)))])
    if user.insurance_coverage < 25:
        advices.append(["Insurance", "Your insurance coverage is less than 25%. Do consider purchasing insurance."])
    elif user.insurance_coverage < 50:
        advices.append(
            ["Insurance", "Your insurance coverage is between 25% and 50%, but it's better to be safe than sorry!"])
    for k, v in budget_actual.items():
        if budget_template[k] < budget_goal[k]:
            advices.append(
                ["Budget", "Your budget for %s seems rather high. You may want to consider lowering it." % (k)])
        if budget_goal[k] + 10 < v:
            advices.append(["Budget", "You have exceeded the budget percentage for %s. Watch out!" % (k)])
    if user.calculated_balance > 6 * constants.LAST_MONTHS_EXPENDITURE:
        if user.risk_factor < 1.5:
            advices.append(
                ["Investment", " You may want to invest in safe investments such as Brokered CDs or Treasury Bonds."])
        elif user.risk_factor < 2.5:
            advices.append(["Investment",
                            "You may want to invest in low risk investments such as Treasury Bonds or Municipal Bonds."])
        elif user.risk_factor < 3.5:
            advices.append(["Investment",
                            "You may want to invest in fairly low risk investments such as Muncipal Bonds or Fixed and Indexed Annuities, or Bonds of Fortune 500 Corporations."])
        elif user.risk_factor < 4.5:
            advices.append(["Investment",
                            "You may want to invest in moderate risk investments such as Investment-grade Corporate Bonds, Utility Stocks or Preferred Stocks. Don't forget to do your research!"])
        elif user.risk_factor < 5.5:
            advices.append(["Investment",
                            "You may want to invest in moderate risk investments such as Preferred Stocks, Real Estate or Income Mutual Funds. Don't forget to do your research!"])
        elif user.risk_factor < 6.5:
            advices.append(["Investment",
                            "You may want to invest in moderate-to high risk investments such as Income Mutual Funds, Real Estate or Blue Chip Stocks. Do remember to hedge your risk by spending at least half your investment on safer investments."])
        elif user.risk_factor < 7.5:
            advices.append(["Investment",
                            "You may want to invest in fairly high risk investments such as Income Mutual Funds, Small and Mid-cap Stocks or FOREX. Do remember to hedge your risk by spending at least half your investment on safer investments."])
        elif user.risk_factor < 8.5:
            advices.append(["Investment",
                            "You may want to invest in higher risk investments such as FOREX, Small and Mid-cap Stocks or Commodities. Do remember to hedge your risk by spending at least half your investment on safer investments."])
        else:
            advices.append(["Investment",
                            "You may want to invest in speculative investments such as Commodities, Penny Stocks or Finantial Deriatives. Don't put all your eggs in one basket!"])
    if "Car" in possesions and "Car Insurance" not in available_insurance:
        advices.append(["Insurance", "It seems that you own a car. It may be a good idea to consider car insurance."])
    if "House" in possesions and "Home Insurance" not in available_insurance:
        advices.append(["Insureance", "You may want to consider a home insurance."])
    if "Vacation" in possesions and "Travel Insurance" not in available_insurance:
        advices.append(["Insurance",
                        "Congrats on finally saving enough for your holiday! You might want to consider travel insurance."])
    return models.AdvicesMessage(advices=[models.AdviceMessage(type=i[0], content=i[1]) for i in advices])

def add_goals():
    goals = {"College":50000, "Marriage":20000, "House":1000000, "Car":50000, "Child":1000000, "Vacation":5000}
    users = models.User.query().fetch()
    user = users[0]
    for k,v in goals.items():
        user.all_goals.append(models.Goal(name=k, value = v))
    user.put()