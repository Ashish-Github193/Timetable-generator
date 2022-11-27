from schedule import Schedule
from functools import cmp_to_key

class Population(object):
  def __init__(self, size, data):
    self.schedules = [ Schedule(data).initialize() for _ in range(size)]

  def __str__(self):
    return "".join([str(x) for x in self.schedules])

  def sort_by_fitness(self):
    def _sort_schedule(schedule1, schedule2):
      ret_val = 0
      
      if schedule1.fitness > schedule2.fitness:
        ret_val = -1
      elif schedule1.fitness < schedule2.fitness:
        ret_val = 1
      
      return ret_val
    self.schedules = sorted(self.schedules, key=cmp_to_key(_sort_schedule))
    
    return self
