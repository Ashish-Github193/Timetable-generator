from sqlite3 import connect
import os

database = connect(os.getcwd() + "\\data\\database.DB")
cursor = database.cursor()

class Generate_data:
    def __init__(self) -> None:
        self.MEETING_TIME, self.ROOMS, self.TEACHERS, self.SUBJECTS, self.DEPARTMENTS = self.GET_DATA()

    def GET_DATA(self):

        MEETING_TIME = cursor.execute("SELECT * FROM MEETING_TIME").fetchall()
        ROOMS        = cursor.execute("SELECT * FROM ROOMS").fetchall()
        TEACHERS     = cursor.execute("SELECT * FROM TEACHERS").fetchall()
        SUBJECTS     = cursor.execute("SELECT * FROM SUBJECTS").fetchall()
        DEPARTMENTS  = cursor.execute("SELECT * FROM DEPARTMENTS").fetchall()

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
        return final_data

    def MAKE_MEETING_TIME (self):
        mwf_meetings = []
        start_time = int(self.MEETING_TIME[0][0][0:2])
        end_time = (start_time + int(self.MEETING_TIME[0][2])) % 24
        for i in range(int(self.MEETING_TIME[0][1])):
            mwf_meetings.append(["MWF_" + str(i), f"MWF {str(start_time)}:00 - {str(end_time)}:00"])
            start_time = end_time
            end_time = (start_time + int(self.MEETING_TIME[0][2])) % 24
        
        tts_meetings = []
        start_time = int(self.MEETING_TIME[1][0][0:2])
        end_time = int(start_time + int(self.MEETING_TIME[1][2])) % 24 
        for i in range(int(self.MEETING_TIME[1][1])):
            tts_meetings.append(["TTS_" + str(i), f"TTS {str(start_time)}:00 - {str(end_time)}:00"])
            start_time = end_time
            end_time = (start_time + int(self.MEETING_TIME[0][2])) % 24

        print (mwf_meetings)
        print (tts_meetings)
        return mwf_meetings, tts_meetings

    def MAKE_ROOMS (self):
        print (self.ROOMS)
        return self.ROOMS
        
    def MAKE_INSTRUCTORS (self):
        print (self.TEACHERS) 
        return self.TEACHERS
    
    def MAKE_COURSES (self):
        print (self.SUBJECTS)
        return self.SUBJECTS

    def MAKE_DEPARTMENTS (self):
        print(self.DEPARTMENTS)
        return self.DEPARTMENTS