import endpoints
import models
import datetime
import functions
import requests

from protorpc import message_types
from protorpc import remote


@endpoints.api(name='plutusapi', version='v1')
class PlutusAPI(remote.Service):
    # Post
    @endpoints.method(models.SignUpMessage, message_types.VoidMessage,
                      path='signup', http_method='POST',
                      name='signup')
    def signup(self, request):
        models.User(age=request.age, income=request.income, is_income_stable=request.is_income_stable,
                    balance=request.balance).put()
        functions.add_goals()
        return message_types.VoidMessage()

    @endpoints.method(models.DesiredSavingMessage, message_types.VoidMessage,
                      path='add_desired_saving', http_method='POST',
                      name='add_desired_saving')
    def add_desired_saving(self, request):
        users = models.User.query().fetch()
        user = users[0]
        user.desired_saving = request.desired_saving
        user.put()
        return message_types.VoidMessage()

    @endpoints.method(models.AssetMessage, message_types.VoidMessage,
                      path='add_asset', http_method='POST',
                      name='add_asset')
    def add_asset(self, request):
        users = models.User.query().fetch()
        user = users[0]
        user.assets.append(models.Asset(name=request.name, value=request.value, passive_income=request.passive_income,
                                        period=request.period))
        user.put()
        return message_types.VoidMessage()

    @endpoints.method(models.PeriodicSpendingMessage, message_types.VoidMessage,
                      path='add_periodic_spending', http_method='POST',
                      name='add_periodic_spending')
    def add_periodic_spending(self, request):
        users = models.User.query().fetch()
        user = users[0]
        user.periodic_spending.append(
            models.PeriodicSpending(name=request.name, value=request.value, period=request.period))
        user.put()
        return message_types.VoidMessage()

    @endpoints.method(models.BudgetsMessage, message_types.VoidMessage,
                      path='add_budget', http_method='POST',
                      name='add_budget')
    def add_budget(self, request):
        users = models.User.query().fetch()
        user = users[0]
        for budget in request.budgets:
            user.budget.append(models.Budget(type=budget.type, percentage=budget.percentage))
        user.put()
        return message_types.VoidMessage()

    @endpoints.method(models.InvestmentMessage, message_types.VoidMessage,
                      path='add_investment', http_method='POST',
                      name='add_investment')
    def add_investment(self, request):
        users = models.User.query().fetch()
        user = users[0]
        if request.type == "Bond":
            user.all_investments.append(
                models.Investment(name=request.name, type=request.type, value=request.value, date_end=request.date_end,
                                  interest=request.interest, period=request.period))
        elif request.type == "Stocks":
            user.all_investments.append(
                models.Investment(name=request.name, type=request.type, value=request.value, qty=request.qty,
                                  ticker=request.ticker))
        else:
            user.all_investments.append(
                models.Investment(name=request.name, type=request.type, value=request.value, qty=request.qty))
        user.put()
        return message_types.VoidMessage()

    @endpoints.method(models.InsuranceMessage, message_types.VoidMessage,
                      path='add_insurance', http_method='POST',
                      name='add_insurance')
    def add_insurance(self, request):
        users = models.User.query().fetch()
        user = users[0]
        user.all_insurances.append(
            models.Insurance(name=request.name, type=request.type, expiry=request.expiry))
        user.periodic_spending.append(
            models.PeriodicSpending(name="%s(%s)" % (request.name, request.type), value=request.premium, period=30))
        user.put()
        return message_types.VoidMessage()

    @endpoints.method(models.ExpenditureMessage, message_types.VoidMessage,
                      path='add_expenditure', http_method='POST',
                      name='add_expenditure')
    def add_expenditure(self, request):
        users = models.User.query().fetch()
        user = users[0]
        user.all_expenditure.append(
            models.Expenditure(name=request.name, type=request.type, value=request.value))
        user.put()
        return message_types.VoidMessage()

    @endpoints.method(models.GoalMessage, message_types.VoidMessage,
                      path='add_goal', http_method='POST',
                      name='add_goal')
    def add_goal(self, request):
        users = models.User.query().fetch()
        user = users[0]
        user.all_goals.append(
            models.Goal(name=request.name, value=request.value, percent_completed=request.percent_completed,
                        is_default=request.is_default, is_achieved=request.is_achieved))
        user.put()
        return message_types.VoidMessage()

    @endpoints.method(models.ValueMessage, message_types.VoidMessage,
                      path='update_balance', http_method='POST',
                      name='update_balance')
    def update_balance(self, request):
        users = models.User.query().fetch()
        user = users[0]
        user.balance = request.value
        user.put()
        return message_types.VoidMessage()

    @endpoints.method(models.GoalMessage, message_types.VoidMessage,
                      path='update_goal', http_method='POST',
                      name='update_goal')
    def update_goal(self, request):
        users = models.User.query().fetch()
        user = users[0]
        goals = user.all_goals
        for goal in goals:
            if goal.name == request.name:
                goal.is_achieved = request.is_achieved
                user.all_expenditure.append(
                    models.Expenditure(name=goal.name, type="Misc", value=goal.value))
        user.goals = goals
        user.put()
        return message_types.VoidMessage()
    # Get
    @endpoints.method(message_types.VoidMessage, models.UserMessage,
                      path='get_basic_data', http_method='GET',
                      name='get_basic_data')
    def get_basic_data(self, request):
        users = models.User.query().fetch()
        user = users[0]
        return models.UserMessage(age=user.age, income=user.income, is_income_stable=user.is_income_stable,
                                  desired_saving=user.desired_saving)

    @endpoints.method(message_types.VoidMessage, models.AssetsMessage,
                      path='get_assets', http_method='GET',
                      name='get_assets')
    def get_assets(self, request):
        users = models.User.query().fetch()
        user = users[0]
        assets = models.AssetsMessage(
            assets=[models.AssetMessage(name=i.name, value=i.value, passive_income=i.passive_income, period=i.period)
                    for i in user.assets])
        return assets

    @endpoints.method(message_types.VoidMessage, models.PeriodicSpendingsMessage,
                      path='get_periodic_spending', http_method='GET',
                      name='get_periodic_spending')
    def get_periodic_spending(self, request):
        users = models.User.query().fetch()
        user = users[0]
        spendings = models.PeriodicSpendingsMessage(
            spendings=[models.PeriodicSpendingMessage(name=i.name, value=i.value, period=i.period) for i in
                       user.periodic_spending])
        return spendings

    @endpoints.method(message_types.VoidMessage, models.BudgetsMessage,
                      path='get_budget', http_method='GET',
                      name='get_budget')
    def get_budget(self, request):
        users = models.User.query().fetch()
        user = users[0]
        budgets = models.BudgetsMessage(
            budgets=[models.BudgetMessage(type=i.type, percentage=i.percentage) for i
                     in user.budget])
        return budgets

    @endpoints.method(message_types.VoidMessage, models.InvestmentsMessage,
                      path='get_investment', http_method='GET',
                      name='get_investment')
    def get_investment(self, request):
        users = models.User.query().fetch()
        user = users[0]
        investments = []
        for i in user.all_investments:
            investments.append(
                models.InvestmentMessage(name=i.name, type=i.type, value=i.value, qty=i.qty, date_end=i.date_end,
                                         interest=i.interest, period=i.period, ticker=i.ticker))

        return models.InvestmentsMessage(investments=investments)

    @endpoints.method(message_types.VoidMessage, models.InsurancesMessage,
                      path='get_insurance', http_method='GET',
                      name='get_insurance')
    def get_insurance(self, request):
        users = models.User.query().fetch()
        user = users[0]
        insurances = models.InsurancesMessage(
            insurances=[models.InsuranceMessage(name=i.name, type=i.type, expiry=i.expiry) for i
                        in user.all_insurances])
        return insurances

    @endpoints.method(message_types.VoidMessage, models.ExpendituresMessage,
                      path='get_expenditure', http_method='GET',
                      name='get_expenditure')
    def get_expenditure(self, request):
        users = models.User.query().fetch()
        user = users[0]
        total = sum([i.value for i in user.all_expenditure])
        expenditures = models.ExpendituresMessage(total=total, expenditures=[
            models.ExpenditureMessage(name=i.name, type=i.type, value=i.value, date=i.date) for i
            in user.all_expenditure])
        return expenditures

    @endpoints.method(message_types.VoidMessage, models.GoalsMessage,
                      path='get_goals', http_method='GET',
                      name='get_goals')
    def get_goals(self, request):
        users = models.User.query().fetch()
        user = users[0]
        goals = models.GoalsMessage(
            goals=[models.GoalMessage(name=i.name, value=i.value, percent_completed=i.percent_completed,
                                      is_default=i.is_default, is_achieved=i.is_achieved) for i
                   in user.all_goals])
        return goals

    @endpoints.method(message_types.VoidMessage, models.ValueMessage,
                      path='get_balance', http_method='GET',
                      name='get_balance')
    def get_balance(self, request):
        users = models.User.query().fetch()
        user = users[0]
        return models.ValueMessage(value=user.calculated_balance)

    @endpoints.method(message_types.VoidMessage, models.ValueMessage,
                      path='get_insurance_coverage', http_method='GET',
                      name='get_insurance_coverage')
    def get_insurance_coverage(self, request):
        users = models.User.query().fetch()
        user = users[0]
        return models.ValueMessage(value=user.insurance_coverage)

    @endpoints.method(message_types.VoidMessage, models.ValueMessage,
                      path='get_reccomended_savings', http_method='GET',
                      name='get_reccomended_savings')
    def get_recommended_savings(self, request):
        users = models.User.query().fetch()
        user = users[0]
        return models.ValueMessage(value=user.recommended_savings)

    @endpoints.method(message_types.VoidMessage, models.ValueMessage,
                      path='get_risk_factor', http_method='GET',
                      name='get_risk_factor')
    def get_risk_factor(self, request):
        users = models.User.query().fetch()
        user = users[0]
        return models.ValueMessage(value=user.risk_factor)

    @endpoints.method(message_types.VoidMessage, models.ValueMessage,
                      path='get_total_passive_income', http_method='GET',
                      name='get_total_passive_income')
    def get_total_passive_income(self, request):
        users = models.User.query().fetch()
        user = users[0]
        return models.ValueMessage(value=user.total_passive_income)

    @endpoints.method(message_types.VoidMessage, models.ValueMessage,
                      path='get_total_periodic_spending', http_method='GET',
                      name='get_total_periodic_spending')
    def get_total_periodic_spending(self, request):
        users = models.User.query().fetch()
        user = users[0]
        return models.ValueMessage(value=user.total_periodic_spending)

    @endpoints.method(message_types.VoidMessage, models.ValueMessage,
                      path='get_net_worth', http_method='GET',
                      name='get_net_worth')
    def get_net_worth(self, request):
        users = models.User.query().fetch()
        user = users[0]
        return models.ValueMessage(value=user.net_worth)

    @endpoints.method(message_types.VoidMessage, models.BudgetsMessage,
                      path='get_pie', http_method='GET',
                      name='get_pie')
    def get_pie(self, request):
        return models.BudgetsMessage(budgets=functions.get_pie())

    @endpoints.method(message_types.VoidMessage, models.AdvicesMessage,
                      path='get_advice', http_method='GET',
                      name='get_advice')
    def get_advice(self, request):
        return functions.get_advice()


API = endpoints.api_server([PlutusAPI])
