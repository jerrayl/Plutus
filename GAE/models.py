from google.appengine.ext import ndb
from protorpc import messages
from protorpc import message_types
import functions


class Asset(ndb.Model):
    name = ndb.StringProperty(required=True)
    value = ndb.FloatProperty(required=True)
    passive_income = ndb.FloatProperty(default=0)
    period = ndb.IntegerProperty(required=True)


class PeriodicSpending(ndb.Model):
    name = ndb.StringProperty(required=True)
    value = ndb.FloatProperty(required=True)
    period = ndb.IntegerProperty(required=True)


class Expenditure(ndb.Model):
    name = ndb.StringProperty(required=True)
    type = ndb.StringProperty(required=True)
    value = ndb.FloatProperty(required=True)
    date = ndb.DateTimeProperty(auto_now_add=True)


class Goal(ndb.Model):
    name = ndb.StringProperty(required=True)
    value = ndb.FloatProperty(required=True, default=0)
    percent_completed = ndb.FloatProperty()
    is_default = ndb.BooleanProperty(required=True, default=False)
    is_achieved = ndb.BooleanProperty(required=True, default=False)


class Budget(ndb.Model):
    type = ndb.StringProperty(required=True)
    percentage = ndb.FloatProperty(required=True)


class Investment(ndb.Model):
    name = ndb.StringProperty(required=True)
    type = ndb.StringProperty(required=True)
    value = ndb.FloatProperty(required=True)
    qty = ndb.FloatProperty(required=True)
    date_start = ndb.DateTimeProperty(auto_now_add=True)
    date_end = ndb.DateTimeProperty()
    interest = ndb.FloatProperty()
    period = ndb.IntegerProperty()
    ticker = ndb.StringProperty()


class Insurance(ndb.Model):
    name = ndb.StringProperty(required=True)
    type = ndb.StringProperty(required=True)
    expiry = ndb.DateTimeProperty(required=True)


# ONlY THIS IS DIRECTLY USED
class User(ndb.Model):
    # Added upon first startup
    age = ndb.IntegerProperty(required=True)
    income = ndb.IntegerProperty(required=True)
    is_income_stable = ndb.BooleanProperty(required=True)
    balance = ndb.FloatProperty(required=True)
    # Added later
    desired_saving = ndb.FloatProperty()
    assets = ndb.StructuredProperty(Asset, repeated=True)
    periodic_spending = ndb.StructuredProperty(PeriodicSpending, repeated=True)
    budget = ndb.StructuredProperty(Budget, repeated=True)
    all_investments = ndb.StructuredProperty(Investment, repeated=True)
    all_insurances = ndb.StructuredProperty(Insurance, repeated=True)
    all_expenditure = ndb.StructuredProperty(Expenditure, repeated=True)
    all_goals = ndb.StructuredProperty(Goal, repeated=True)
    # Calculated
    calculated_balance = ndb.ComputedProperty(functions.calc_balance)
    total_passive_income = ndb.ComputedProperty(functions.calc_passive_income)
    total_periodic_spending = ndb.ComputedProperty(functions.calc_periodic_spending)
    insurance_coverage = ndb.ComputedProperty(functions.calc_insurance_coverage)
    risk_factor = ndb.ComputedProperty(functions.calc_risk_factor)
    recommended_savings = ndb.ComputedProperty(functions.calc_recommended_savings)
    net_worth = ndb.ComputedProperty(functions.calc_net_worth)


class BasicDataMessage(messages.Message):
    age = messages.IntegerField(1)
    income = messages.FloatField(2)
    is_income_stable = messages.BooleanField(3)


class DesiredSavingMessage(messages.Message):
    desired_saving = messages.FloatField(1)


class AssetMessage(messages.Message):
    name = messages.StringField(1)
    value = messages.FloatField(2)
    passive_income = messages.FloatField(3)
    period = messages.IntegerField(4)


class AssetsMessage(messages.Message):
    assets = messages.MessageField(AssetMessage, 1, repeated=True)


class PeriodicSpendingMessage(messages.Message):
    name = messages.StringField(1)
    value = messages.FloatField(2)
    period = messages.IntegerField(3)


class PeriodicSpendingsMessage(messages.Message):
    spendings = messages.MessageField(PeriodicSpendingMessage, 1, repeated=True)


class BudgetMessage(messages.Message):
    type = messages.StringField(1)
    percentage = messages.FloatField(2)


class BudgetsMessage(messages.Message):
    budgets = messages.MessageField(BudgetMessage, 1, repeated=True)


class InvestmentMessage(messages.Message):
    name = messages.StringField(1)
    type = messages.StringField(2)
    value = messages.FloatField(3)
    qty = messages.FloatField(4)
    date_end = message_types.DateTimeField(5)
    interest = messages.FloatField(6)
    period = messages.IntegerField(7)
    ticker = messages.StringField(8)



class InvestmentsMessage(messages.Message):
    investments = messages.MessageField(InvestmentMessage, 1, repeated=True)


class InsuranceMessage(messages.Message):
    name = messages.StringField(1)
    type = messages.StringField(2)
    expiry = message_types.DateTimeField(3)
    premium = messages.FloatField(4)

class InsurancesMessage(messages.Message):
    insurances = messages.MessageField(InsuranceMessage, 1, repeated=True)


class ExpenditureMessage(messages.Message):
    name = messages.StringField(1)
    type = messages.StringField(2)
    value = messages.FloatField(3)
    date = message_types.DateTimeField(4)


class ExpendituresMessage(messages.Message):
    total = messages.FloatField(1)
    expenditures = messages.MessageField(ExpenditureMessage, 2, repeated=True)


class GoalMessage(messages.Message):
    name = messages.StringField(1)
    value = messages.FloatField(2)
    percent_completed = messages.FloatField(3)
    is_default = messages.BooleanField(4)
    is_achieved = messages.BooleanField(5, default=False)

class GoalsMessage(messages.Message):
    goals = messages.MessageField(GoalMessage, 1, repeated=True)


class UserMessage(messages.Message):
    age = messages.IntegerField(1)
    income = messages.IntegerField(2)
    is_income_stable = messages.BooleanField(3)
    desired_saving = messages.FloatField(4)

class SignUpMessage(messages.Message):
    age = messages.IntegerField(1)
    income = messages.IntegerField(2)
    is_income_stable = messages.BooleanField(3)
    balance = messages.FloatField(4)

class ValueMessage(messages.Message):
    value = messages.FloatField(1)

class AdviceMessage(messages.Message):
    type = messages.StringField(1)
    content = messages.StringField(2)

class AdvicesMessage(messages.Message):
    advices = messages.MessageField(AdviceMessage, 1, repeated=True)