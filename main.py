from sqlite3 import connect
import eel
from driver import *

eel.init("web")
database = connect("data/database.DB")
cursor = database.cursor()

@eel.expose
def SAVE_DATA(zipped_data):

    cursor.execute ("DROP TABLE MEETING_TIME;")
    cursor.execute ("DROP TABLE ROOMS;")
    cursor.execute ("DROP TABLE TEACHERS;")
    cursor.execute ("DROP TABLE SUBJECTS;")
    cursor.execute ("DROP TABLE DEPARTMENTS;")
    database.commit ()

    cursor.execute ("CREATE TABLE MEETING_TIME (TIME CHAR(5) NOT NULL, HOURS INT NOT NULL, MERIDIEN INT NOT NULL)")
    cursor.execute ("CREATE TABLE ROOMS (ID INT NOT NULL, TYPE CHAR(5) NOT NULL, CAPACITY INT NOT NULL);")
    cursor.execute ("CREATE TABLE TEACHERS (SERIAL_CODE INT NOT NULL, NAME CHAR (50) NOT NULL, PHONE LONG INT NOT NULL, EMAIL_ID CHAR(100) NOT NULL);")
    cursor.execute ("CREATE TABLE SUBJECTS (SERIAL_CODE INT NOT NULL, NAME CHAR (50), NUMBER_OF_STUDENTS INT NOT NULL, TEACHERS CHAR (80) NOT NULL);")
    cursor.execute ("CREATE TABLE DEPARTMENTS (SERIAL_CODE INT NOT NULL, NAME CHAR (50) NOT NULL, SUBJECT CHAR (50) NOT NULL);")
    database.commit ()

    MEETING_TIME, ROOMS, TEACHERS, SUBJECTS, DEPARTMENTS = zipped_data
    
    #--------------------------- MEETING TIME --------------------------- #
    for row in MEETING_TIME:
        cursor.execute (f"INSERT INTO MEETING_TIME (TIME, HOURS, MERIDIEN) VALUES ('{row[0]}', '{row[1]}', '{row[2]}')")

    #------------------------------- ROOMS -------------------------------#
    for row in ROOMS:
        cursor.execute (f"INSERT INTO ROOMS (ID, TYPE, CAPACITY) VALUES ('{row[0]}', '{row[1]}', '{row[2]}')")

    #----------------------------- TEACHERS ------------------------------#
    for row in TEACHERS:
        cursor.execute (f"INSERT INTO TEACHERS (SERIAL_CODE, NAME, PHONE, EMAIL_ID) VALUES ('{row[0]}', '{row[1]}', '{row[2]}', '{row[3]}')")

    #----------------------------- SUBJECTS ----------------------------- #
    for row in SUBJECTS:
        for teacher in row[3:len(row)]:
            cursor.execute (f"INSERT INTO SUBJECTS (SERIAL_CODE, NAME, NUMBER_OF_STUDENTS, TEACHERS) VALUES ('{row[0]}', '{row[1]}', '{row[2]}', '{teacher}')")

    #---------------------------- DEPARTMENTS --------------------------- #
    for row in DEPARTMENTS:
        for subject in row[2:len(row)]:
            cursor.execute (f"INSERT INTO DEPARTMENTS (SERIAL_CODE, NAME, SUBJECT) VALUES ('{row[0]}', '{row[1]}', '{subject}')")

    database.commit()
    return "SAVED"

@eel.expose
def GET_DATA():
    MEETING_TIME = cursor.execute("SELECT * FROM MEETING_TIME").fetchall()
    ROOMS = cursor.execute("SELECT * FROM ROOMS").fetchall()
    TEACHERS = cursor.execute("SELECT * FROM TEACHERS").fetchall()
    SUBJECTS = cursor.execute("SELECT * FROM SUBJECTS").fetchall()
    DEPARTMENTS = cursor.execute("SELECT * FROM DEPARTMENTS").fetchall()

    for i in range(len(MEETING_TIME)):
        MEETING_TIME[i] = list(MEETING_TIME[i])

    for i in range(len(ROOMS)):
        ROOMS[i] = list(ROOMS[i])

    for i in range(len(TEACHERS)):
        TEACHERS[i] = list(TEACHERS[i])

    lis = [[], []]
    for sub in SUBJECTS:
        if sub[0] not in lis[0]:
            lis[0].append(sub[0])
            lis[1].append(list(sub))
        else:
            lis[1][lis[0].index(sub[0])].append(sub[3])
    SUBJECTS = lis[1]

    lis = [[], []]
    for sub in DEPARTMENTS:
        if sub[0] not in lis[0]:
            lis[0].append(sub[0])
            lis[1].append(list(sub))
        else:
            lis[1][lis[0].index(sub[0])].append(sub[2])
    DEPARTMENTS = lis[1]
    

    final_data = [MEETING_TIME, ROOMS, TEACHERS, SUBJECTS, DEPARTMENTS]
    # print(final_data)
    return final_data

# ---------------------------------------------------Driver.py---------------------------------------------------#

@eel.expose
def run():
  global SCHEDULE_NUMBER, CLASS_NO

  from data import Data
  from genetic_algorithm import GeneticAlgorithm
  from population import Population

  generation_number = 0
  data = Data()
  _genetic_algorithm = GeneticAlgorithm(data=data)
  _population = Population(size=POPULATION_SIZE, data=data).sort_by_fitness()

  print_data(data=data)

  print_population_schedules(population=_population, generation_number=generation_number)
  updated_data = print_schedule_as_table(data=data, schedule=_population.schedules[0], generation=generation_number)
  if _population.schedules[0].fitness == 1.0:
    return updated_data

  while _population.schedules[0].fitness != 1.0:
    generation_number += 1
    _population = _genetic_algorithm.evolve(population=_population).sort_by_fitness()

    print_population_schedules(population=_population, generation_number=generation_number)
    updated_data = print_schedule_as_table(data=data, schedule=_population.schedules[0], generation=generation_number)
  return updated_data

if __name__ == "__main__":
    sys.path.insert(0, path.dirname(path.abspath(__file__)))
    eel.start("main.html", mode="default")