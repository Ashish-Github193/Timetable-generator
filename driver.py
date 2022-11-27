import json
from tabulate import tabulate
from os import sys, path

from utils import print_data, print_population_schedules, print_schedule_as_table

POPULATION_SIZE           = 5
MUTATION_RATE             = 0.1
CROSSOVER_RATE            = 0.01
TOURNAMENT_SELECTION_SIZE = 2
NUMB_OF_ELITE_SCHEDULES   = 1