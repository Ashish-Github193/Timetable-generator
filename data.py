from domain import (
  Class,
  Course,
  Department,
  Instructor,
  MeetingTime,
  Room
)
from get_data import Generate_data

class Data(object):
  def __init__(self):
    self.data_class = Generate_data()
    self.rooms = None
    self.instructors = None
    self.courses = None
    self.depts = None
    self.meeting_times = None
    self.number_of_classes = None

    self.initialize()
  
  def initialize (self):
    # create rooms
    self.rooms = []
    room_raw_data = self.data_class.MAKE_ROOMS()
    for room in room_raw_data:
      self.rooms.append(Room(number=str(room[0]), seating_capacity=room[2]))
# 
    # create meeting times
    self.meeting_times = []
    raw_meeting_mwf_data, raw_meeting_tts_data = self.data_class.MAKE_MEETING_TIME()
    for meeting in raw_meeting_mwf_data:
      self.meeting_times.append(MeetingTime(id=meeting[0], time=meeting[1]))
# 
    for meeting in raw_meeting_tts_data:
      self.meeting_times.append(MeetingTime(id=meeting[0], time=meeting[1]))
# 
    # create instructor
    self.instructors = []
    raw_instructor_data = self.data_class.MAKE_INSTRUCTORS()
    for instructor in raw_instructor_data:
      self.instructors.append(Instructor(id=instructor[0], name=instructor[1]))
  # 
    # create courses
    self.courses = []
    raw_courses_data = self.data_class.MAKE_COURSES()
    for course in raw_courses_data:
      inst_list = []
      for i in course[3:]:
        for ins in self.instructors:
          if i == ins.name:
            inst_list.append(ins)
      self.courses.append(Course(number=course[0], name=course[1], max_number_of_students=course[2], instructors=inst_list))
# 
    # create departments
    self.depts = []
    raw_depts_data = self.data_class.MAKE_DEPARTMENTS()
    for dept in raw_depts_data:
      course_list = []
      for c in dept[2:]:
        for cou in self.courses:
          if cou.name == c:
            course_list.append(cou)
      self.depts.append(Department(name=dept[1], courses=course_list))
# 
    # define the number of classes
    self.number_of_classes = sum([len(x.courses) for x in self.depts])