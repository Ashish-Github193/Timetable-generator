var final_dict = {
    time: undefined,
    rooms: undefined,
    teachers: undefined,
    subjects: undefined,
    departments: undefined,
};

var final_list,
    roomsDataLen,
    teachersDataLen,
    subjectsDataLen,
    departmentsDataLen,
    meetingTimeTableData,
    roomTableData,
    teacherTableData,
    subjectTableData,
    departmentTableData,
    meetingTimeTable,
    roomTable,
    teacherTable,
    subjectTable,
    departmentTable,
    teacherSelectionList,
    teacherSelectionListYes,
    teacherSelectionListNo,
    addTeacherBtn,
    selectedTeachers,
    finalSelectedTeachers,
    selectedSubjects,
    finalSelectedSubjects,
    timesTeacherListOpen,
    timesSubjectListOpen,
    addSubjectRow,
    addDeptRow,
    alertBox,
    alertConfirmationBox,
    alertConfYes,
    alertConfNo,
    timeTableContainer,
    finalConfirmationBtnwrap,
    timeTable;

alertBox = byClass('alert-box')[0];
alertConfirmationBox = byClass('alert-confirmation-box')[0];
alertConfYes = id('alert-btn-yes');
alertConfNo = id('alert-btn-no');
alert = byClass('alert')[0];

mainHeading = byClass('main-heading')[0];
meetingTimeTable =  byClass('main-container')[0].children[0];
roomTable =  byClass('main-container')[0].children[1].children[1];
teacherTable =  byClass('main-container')[0].children[2].children[1];
subjectTable =  byClass('main-container')[0].children[3].children[1];
departmentTable   =  byClass('main-container')[0].children[4].children[1];

addTeacherBtn = id('add-teacher');
teacherSelectionList = byClass('teachers-list')[0];
teacherSelectionListYes = id('teacher-btn-yes');
teacherSelectionListNo = id('teacher-btn-no');
teacherMainList = teacherSelectionList.children[1];

finalConfirmationBtnwrap = byClass('final-response-container')[0];
timeTableContainer = byClass('final-time-table-container')[0];
timeTable = id('time-table');

const sleep = ms => new Promise(res => setTimeout(res, ms));

function save_data() {

    // saving meeting time data
    
    final_list[0][0][0]=id('mwf-start-time').value ;
    final_list[0][0][1]=id('mwf-total-time').value ;
    final_list[0][0][2]=id('mwf-class-duration').value 
    final_list[0][1][0]=id('tts-start-time').value ;
    final_list[0][1][1]=id('tts-total-time').value ;
    final_list[0][1][2]=id('tts-class-duration').value ;


    eel.SAVE_DATA (final_list);
    alertBox.style.display = 'flex';
    alertConfirmationBox.style.display = 'none';
    alert.innerHTML = 'data saved succesfully';

    setTimeout(()=> {alert.innerHTML = 'processing data...'}, 500);

    generate_table().then(
        (data) => {
            console.log(data);
            alertBox.style.display = 'none';
            showTimeTable(data);

        }).catch(
        ()=>{
            alert.innerHTML = 'something went wrong, try again.';
            setInterval(()=>{alertBox.display = 'none';}, 2000);
    });

    // console.log(timeTableData); problem is when it runs promise havent given the value;



}

async function get_data() {
    var final_list = await eel.GET_DATA()(); 
    return final_list;
}

async function generate_table() {
    var data = await eel.run()();
    return data;
}


function showTimeTable(data) {
    console.log(timeTable);
    timeTableContainer.style.display = 'flex';
    mainHeading.innerHTML = 'Time Table Generated';
    meetingTimeTable.style.display = 'none';
    roomTable.parentElement.style.display = 'none';
    teacherTable.parentElement.style.display = 'none';
    subjectTable.parentElement.style.display = 'none';
    departmentTable.parentElement.style.display = 'none';
    finalConfirmationBtnwrap.style.display = 'none';

    for (let row=0; row<data.length; row++){
        // console.log(row, data[row], data.length);
        row_ele = cele('tr');
        for (let unit=0; unit<data[row].length; unit++) {
            // console.log(data[row][unit]);
            unitData = data[row][unit];
            box = cele('td');
            box.innerHTML = unitData;
            row_ele.appendChild(box);
        }
        timeTable.children[0].appendChild(row_ele);
        
    }

}

function printTable() {
    window.print();
}


get_data().then(final_data => {

    final_list = final_data;
    meetingTimeTableData = final_list[0];
    roomTableData = final_list[1];
    teacherTableData = final_list[2];
    subjectTableData = final_list[3];
    departmentTableData = final_list[4];

    meetingTimeTable =  byClass('main-container')[0].children[0];
    roomTable =  byClass('main-container')[0].children[1].children[1];
    teacherTable =  byClass('main-container')[0].children[2].children[1];
    subjectTable =  byClass('main-container')[0].children[3].children[1];
    departmentTable   =  byClass('main-container')[0].children[4].children[1];

    addTeacherBtn = id('add-teacher');
    teacherSelectionList = byClass('teachers-list')[0];
    teacherSelectionListYes = id('teacher-btn-yes');
    teacherSelectionListNo = id('teacher-btn-no');
    teacherMainList = teacherSelectionList.children[1];
    timesTeacherListOpen = 0;
    selectedTeachers = [];
    finalSelectedTeachers = [];

    addSubjectBtn = id('add-subject');
    subjectSelectionList = byClass('subject-list')[0];
    subjectSelectionListYes = id('subject-btn-yes');
    subjectSelectionListNo = id('subject-btn-no');
    subjectMainList = subjectSelectionList.children[1];
    timesSubjectListOpen = 0;
    selectedSubjects = [];
    finalSelectedSubjects = [];

    addDeptRow = byClass('add-dept-row')[0];
    addSubjectRow = byClass('add-subject-row')[0];


    // console.log(meetingTimeTable.outerHTML);
    fillTeacherData();
    fillTimeData(); 
    fillRoomData();
    fillSubjectData();
    fillDepartData();
    // filling initial value to the teacher table 

    function fillTeacherData() {
        for (let i=0; i<teacherTableData.length; i++) {
            row = teacherTableData[i];
            row_ele = cele('tr');
            row_ele.id = 'ttr' + (teacherTable.children[0].children.length-1);
            
            const ele_id = cele('td');
            const ele_name = cele('td');
            const ele_number = cele('td');
            const ele_mail = cele('td');
            const options = cele('td');
            const remove = cele('button');
            remove.classList.add('btn');
            remove.classList.add('rem-row');
            remove.innerHTML = 'remove';
            remove.addEventListener('click', removeRow)
            options.appendChild(remove);
            
            ele_id.innerHTML = teacherTableData[i][0];
            ele_name.innerHTML = teacherTableData[i][1];
            ele_number.innerHTML = teacherTableData[i][2];
            ele_mail.innerHTML = teacherTableData[i][3];

            row_ele.appendChild(ele_id);
            row_ele.appendChild(ele_name);
            row_ele.appendChild(ele_number);
            row_ele.appendChild(ele_mail);
            row_ele.appendChild(options);

            teacherTable.children[0].insertBefore(row_ele, teacherTable.children[0].children[teacherTable.children[0].children.length-1]);
            // teacherTable.appendChild(row_ele);
            // console.log(teacherTable.children[0].children[i]);
        }

    }


    function fillTimeData() {
        table = id('meeting-time-table');
        const table_data = final_list[0];

        id('mwf-start-time').value =     table_data[0][0];
        id('mwf-total-time').value =     table_data[0][1];
        id('mwf-class-duration').value = table_data[0][2];

        id('tts-start-time').value =     table_data[1][0];
        id('tts-total-time').value =     table_data[1][1];
        id('tts-class-duration').value = table_data[1][2];

    }


    function fillRoomData() {
        table = id('room-table');
        lastRow = table.children[table.children.length-1];
        const table_data = final_list[1];

        for (let i=0; i<table_data.length; i++) {
            console.log()
            row = cele('tr');
            row.id = 'rtr' + (table.children[0].children.length-1);

            const number = cele('td');
            const type = cele('td');
            const capacity = cele('td');
            const options = cele('td');
            const remove = cele('button');
            remove.classList.add('btn');
            remove.classList.add('rem-row');
            remove.innerHTML = 'remove';
            remove.addEventListener('click', removeRow)
            options.appendChild(remove);

            number.innerHTML = table_data[i][0];
            type.innerHTML = table_data[i][1];
            capacity.innerHTML = table_data[i][2];

            row.appendChild(number);
            row.appendChild(type);
            row.appendChild(capacity);
            row.appendChild(options);
            // console.log(table.children[0].children[table.children.length]);
            table.children[0].insertBefore(row, table.children[0].children[table.children[0].children.length-1]);
        }
    }

    function fillSubjectData() {
        table = id('subject-table').children[0];
        lastRow = table.children[table.children.length-1];
        const table_data = final_list[3];

        for (let i=0; i<table_data.length; i++) {
            row_data=[];
            row_data = row_data.concat(table_data[i]);
            // row_data = table_data[i];
            const subRow = cele('tr');
            subRow.id = 'str' + (i+1);
            const subCode = cele('td'); 
            const subName = cele('td');
            const maxStudent = cele('td');
            var subTeacherWrap = cele('td');
            const options = cele('td');
            const remove = cele('button');
            remove.classList.add('btn');
            remove.classList.add('rem-row');
            remove.innerHTML = 'remove';
            remove.addEventListener('click', removeRow)
            options.appendChild(remove);

            subCode.innerHTML = row_data[0];
            subName.innerHTML = row_data[1];
            maxStudent.innerHTML = row_data[2];

            subRow.appendChild(subCode);
            subRow.appendChild(subName);
            subRow.appendChild(maxStudent);

            subTeacherWrap.classList.add('sub-selected-teachers');

            row_data.splice(0, 3);

            
            for (let i=0; i<row_data.length ; i++) {
                const ele = cele('div');
                ele.classList.add('sub-selected-teacher-data');
                ele.innerHTML = row_data[i];
                subTeacherWrap.appendChild(ele);
            }

            subRow.appendChild(subTeacherWrap);
            subRow.appendChild(options);

            table.insertBefore(subRow, table.children[table.children.length-1]);
            
        }

    }



    function fillDepartData() {
        table = id('dept-table').children[0];
        lastRow = table.children[table.children.length-1];
        const table_data = final_list[4];

        for (let i=0; i<table_data.length; i++) {
            row_data = table_data[i];
            const subRow = cele('tr');
            subRow.id = 'dtr' + i;
            const subCode = cele('td'); 
            const subName = cele('td');
            var subTeacherWrap = cele('td');
            const options = cele('td');
            const remove = cele('button');
            remove.classList.add('btn');
            remove.classList.add('rem-row');
            remove.innerHTML = 'remove';
            remove.addEventListener('click', removeRow)
            options.appendChild(remove);


            subCode.innerHTML = row_data[0];
            subName.innerHTML = row_data[1];

            subRow.appendChild(subCode);
            subRow.appendChild(subName);

            subTeacherWrap.classList.add('dept-selected-subjects');


            // console.log(row_data);
            // row_data.splice(0, 3);
            // console.log(row_data);

            
            for (let j=2; j<row_data.length ; j++) {
                const ele = cele('div');
                ele.classList.add('dept-selected-subject-data');
                ele.innerHTML = row_data[j];
                subTeacherWrap.appendChild(ele);
            }

            subRow.appendChild(subTeacherWrap);
            subRow.appendChild(options);

            table.insertBefore(subRow, table.children[table.children.length-1]);
            
        }

    }




    window.onload = () => {
        
        };




    // teacher list operations

    addTeacherBtn.addEventListener('click', addTeacherBtnFunc);

    function addTeacherBtnFunc() {
        timesTeacherListOpen++;
        if (timesTeacherListOpen == 1){
            for (let i=0; i<final_list[2].length; i++) {
            const id_ele = cele('td');
            const name_ele = cele('td');
            const selection_ele = cele('td');
            var chkbx = cele('input');
            chkbx.id = 'tschkbx' + (i+1);
            chkbx.addEventListener('click', selectTeacherChkbx);
            chkbx.type = 'checkbox';
            chkbx.classList.add('center');
            chkbx.classList.add('teacher-selection-chkbx');
            selection_ele.classList.add('pos-rel');
            selection_ele.appendChild(chkbx);

            
            
            id_ele.innerHTML = teacherTableData[i][0];
            name_ele.innerHTML = teacherTableData[i][1];


            const row = cele('tr');
            row.appendChild(id_ele);
            row.appendChild(name_ele);
            row.appendChild(selection_ele);
            teacherMainList.appendChild(row);

            
        }}
        teacherSelectionList.style.display = 'flex';
    }

    function selectTeacherChkbx() {
        // console.log(this.checked);
        if (this.checked == false) {
            const to_rem = this.parentElement.parentElement.children[1].innerHTML;
            for (i in selectedTeachers) {
                if (selectedTeachers[i] == to_rem) {
                    selectedTeachers.splice(i, 1);
                }
            }
        }
        else {
            selectedTeachers.push(this.parentElement.parentElement.children[1].innerHTML);
        }
        // console.log(selectedTeachers);  

        if (selectedTeachers.length>=1) {
            console.log('added event listener')
            teacherSelectionListYes.addEventListener('click', teacherSelectionListYesFunc);
        }
        else {
            teacherSelectionListYes.removeEventListener('click', teacherSelectionListYesFunc);
        }

    }


    function teacherSelectionListYesFunc() {
        console.log(selectedTeachers);
        teacherSelectionList.style.display = 'none';

    }


    teacherSelectionListNo.addEventListener('click', ()=>{
        teacherSelectionList.style.display = 'none';
        selectedTeachers.splice(0, selectedTeachers.length);
        for (let i=0; i<byClass('teacher-selection-chkbx').length ; i++) {
            byClass('teacher-selection-chkbx')[i].checked = false;
        }
    })


    // adding subject row btn


    addSubjectRow.addEventListener('click', fetchTeacherTable);

    function fetchTeacherTable() {
        sbtn = this;
        srow =   sbtn.parentElement.parentElement;
        scode =  srow.children[0].children[0].value;
        sname =  srow.children[1].children[0].value;
        smaxstu = srow.children[2].children[0].value;
        data_list = [];

        if(selectedTeachers.length==0 || selectedTeachers == undefined || scode=='' || sname=='' || smaxstu=='') {
            console.log('enter data properly');
        }
        else {
            nrow = cele('tr');
            ncode = cele('td');
            nname = cele('td');
            nmaxStu = cele('td');
            nteacherswrap = cele('td');
            nbtn = cele('button');
            noption = cele('td');

            nbtn.classList.add('btn');
            nbtn.classList.add('rem-row');
            nbtn.innerHTML = 'remove';
            nbtn.addEventListener('click', removeRow);
            noption.appendChild(nbtn);
            nteacherswrap.classList.add('sub-selected-teachers');

            for (let i=0; i<selectedTeachers.length; i++) {
                let ele = cele('div');
                ele.classList.add('sub-selected-teacher-data');
                ele.innerHTML = selectedTeachers[i] + ' ';
                nteacherswrap.appendChild(ele);
            }
            // nteachers.innerHTML = selectedTeachers.toString();
            for (let i=0; i<3; i++) {
            this.parentElement.parentElement.children[i].children[0].value = '';
            }

            ncode.innerHTML = scode;
            nname.innerHTML = sname;
            nmaxStu.innerHTML = smaxstu;

            nrow.id = 'str'+(this.parentElement.parentElement.parentElement.children.length-1);
            nrow.appendChild(ncode);        
            nrow.appendChild(nname);
            nrow.appendChild(nmaxStu);
            nrow.appendChild(nteacherswrap);
            nrow.appendChild(noption);

            srow.parentElement.insertBefore(nrow, srow);
            data_list = data_list.concat([scode, sname, smaxstu]);
            data_list = data_list.concat(selectedTeachers);
            console.log(data_list);
            selectedTeachers.splice(0, selectedTeachers.length);
            final_list[3].push(data_list);
            temp_list = 0;
            for (i of id('teacher-list-table').children) {
                i.parentElement.removeChild(i);
                console.log(temp_list++);
            }
            timesTeacherListOpen = 0;

        }
    }





























    // subject list operations

    // addSubjectBtn.addEventListener('click', addsubjectBtnFunc);

    // function addsubjectBtnFunc() {
    //     timesSubjectListOpen++;
    //     if (timesSubjectListOpen == 1){for (let i=0; i<subjectTableData.length; i++) {
    //         const id_ele = cele('td');
    //         const name_ele = cele('td');
    //         const selection_ele = cele('td');
    //         const chkbx = cele('input');
    //         chkbx.type = 'checkbox';
    //         chkbx.classList.add('center');
    //         selection_ele.classList.add('pos-rel');
    //         selection_ele.appendChild(chkbx);

    //         id_ele.innerHTML = subjectTableData[i][0];
    //         name_ele.innerHTML = subjectTableData[i][1];

    //         const row = cele('tr');
    //         row.appendChild(id_ele);
    //         row.appendChild(name_ele);
    //         row.appendChild(selection_ele);
    //         subjectMainList.appendChild(row);
    //     }}
    //     subjectSelectionList.style.display = 'flex';
    // }

    // function selectSubjectChkbx() {
    //     // console.log(this.checked);
    //     if (this.checked == false) {
    //         const to_rem = this.parentElement.parentElement.children[1].innerHTML;
    //         for (i in selectedSubjects) {
    //             if (selectedSubjects[i] == to_rem) {
    //                 selectedSubjects.splice(i, 1);
    //             }
    //         }
    //     }
    //     else {
    //         selectedSubjects.push(this.parentElement.parentElement.children[1].innerHTML);
    //     }
    //     // console.log(selectedTeachers);  

    //     if (selectedTeachers.length>=1) {
    //         console.log('added event listener')
    //         subjectSelectionListYes.addEventListener('click', teacherSelectionListYesFunc);
    //     }
    //     else {
    //         subjectSelectionListYes.removeEventListener('click', teacherSelectionListYesFunc);
    //     }

    // }

    // function subjectSelectionListYesFunc() {
    //     console.log(selectedSubjects);
    //     subjectSelectionList.style.display = 'none';

    // }


    // subjectSelectionListNo.addEventListener('click', ()=>{
    //     subjectSelectionList.style.display = 'none';
    //     selectedSubjects.splice(0, selectedSubjects.length);
    //     for (let i=0; i<byClass('subject-selection-chkbx').length ; i++) {
    //         byClass('subject-selection-chkbx')[i].checked = false;
    //     }
    // })

    // // subjectSelectionListYes.addEventListener('click', ()=> {

    // // });


    addSubjectBtn.addEventListener('click', addSubjectBtnFunc);

    function addSubjectBtnFunc() {
        // console.log('clicking');
        timesSubjectListOpen++;
        subjectTableData = final_list[3];
        console.log(subjectTableData, final_list);
        if (timesSubjectListOpen == 1){
        for (let i=0; i<subjectTableData.length; i++) {
            const id_ele = cele('td');
            const name_ele = cele('td');
            const selection_ele = cele('td');
            var chkbx = cele('input');
            chkbx.id = 'tschkbx' + (i+1);
            chkbx.addEventListener('click', selectSubjectChkbx);
            chkbx.type = 'checkbox';
            chkbx.classList.add('center');
            chkbx.classList.add('subject-selection-chkbx');
            selection_ele.classList.add('pos-rel');
            selection_ele.appendChild(chkbx);

            
            console.log(subjectTableData[i]);
            id_ele.innerHTML = subjectTableData[i][0];
            name_ele.innerHTML = subjectTableData[i][1];


            const row = cele('tr');
            row.appendChild(id_ele);
            row.appendChild(name_ele);
            row.appendChild(selection_ele);
            subjectMainList.appendChild(row);

            
        }}
        subjectSelectionList.style.display = 'flex';
    }

    function selectSubjectChkbx() {
        // console.log(this.checked);
        if (this.checked == false) {
            const to_rem = this.parentElement.parentElement.children[1].innerHTML;
            for (i in selectedSubjects) {
                if (selectedSubjects[i] == to_rem) {
                    selectedSubjects.splice(i, 1);
                }
            }
        }
        else {
            selectedSubjects.push(this.parentElement.parentElement.children[1].innerHTML);
        }
        // console.log(selectedSubjects);  

        if (selectedSubjects.length>=1) {
            console.log('added event listener')
            subjectSelectionListYes.addEventListener('click', subjectSelectionListYesFunc);
        }
        else {
            subjectSelectionListYes.removeEventListener('click', subjectSelectionListYesFunc);
        }

    }


    function subjectSelectionListYesFunc() {
        console.log(selectedSubjects);
        subjectSelectionList.style.display = 'none';

    }


    subjectSelectionListNo.addEventListener('click', ()=>{
        subjectSelectionList.style.display = 'none';
        selectedSubjects.splice(0, selectedSubjects.length);
        for (let i=0; i<byClass('subject-selection-chkbx').length ; i++) {
            byClass('subject-selection-chkbx')[i].checked = false;
        }
    })


    // adding subject row btn


    addDeptRow.addEventListener('click', fetchDeptTable);

    function fetchDeptTable() {
        // console.log('clicking');
        data_list = [];
        sbtn = this;
        srow =   sbtn.parentElement.parentElement;
        scode =  srow.children[0].children[0].value;
        sname =  srow.children[1].children[0].value;

        if(selectedSubjects.length==0 || selectedSubjects == undefined || scode=='' || sname=='') {
            console.log('enter data properly');
        }
        else {
            
            nrow = cele('tr');
            ncode = cele('td');
            nname = cele('td');
            nsubjectswrap = cele('td');
            nbtn = cele('button');
            noption = cele('td');

            nbtn.classList.add('btn');
            nbtn.classList.add('rem-row');
            nbtn.innerHTML = 'remove';
            nbtn.addEventListener('click', removeRow);
            noption.appendChild(nbtn);
            nsubjectswrap.classList.add('sub-selected-subjects');

            for (let i=0; i<selectedSubjects.length; i++) {
                let ele = cele('div');
                ele.classList.add('dept-selected-subject-data');
                ele.innerHTML = selectedSubjects[i] + ' ';
                nsubjectswrap.appendChild(ele);
            }
            // nsubjects.innerHTML = selectedSubjects.toString();
            for (let i=0; i<3; i++) {
            this.parentElement.parentElement.children[i].children[0].value = '';
            }

            ncode.innerHTML = scode;
            nname.innerHTML = sname;

            nrow.id = 'str'+(this.parentElement.parentElement.parentElement.children.length-1);
            nrow.appendChild(ncode);        
            nrow.appendChild(nname);
            nrow.appendChild(nsubjectswrap);
            nrow.appendChild(noption);

            srow.parentElement.insertBefore(nrow, srow);
            
            data_list = data_list.concat(Array(scode, sname));
            data_list = data_list.concat(selectedSubjects);
            // console.log(data_list, selectedSubjects);
            selectedSubjects.splice(0, selectedSubjects.length);
            final_list[4].push(data_list);

            for (i of id('subject-list-table').children) {
                i.parentElement.removeChild(i);
            }
            timesSubjectListOpen = 0;

        }
    }


    for (let i=0; i<byClass('clear-btn').length; i++) {
        byClass('clear-btn')[i].addEventListener('click', clearValues);
    }

    function clearValues() {
        // console.log('curring')
        // console.log('button number', this);
        if (this.id == 'mwf-clr-btn') {
        id('mwf-start-time').value =     '00:00';
        id('mwf-total-time').value =     '0';
        id('mwf-class-duration').value =  '0';
        }
        else if (this.id == 'tts-clr-btn') {
        id('tts-start-time').value =     '00:00';
        id('tts-total-time').value =     '0';
        id('tts-class-duration').value = '0';
    }
    }



    for (let i=0; i<byClass('rem-row').length; i++) {
        byClass('rem-row')[i].addEventListener('click', removeRow);
    }

    // remove row

    function removeRow() {
        const row = this.parentElement.parentElement;
        const tableBody = row.parentElement;
        const table = tableBody.parentElement;
        row.style.transform = 'scaleY(0)';
        deletion_id = this.parentElement.parentElement.children[0].innerHTML;
        deletion_index = undefined;
        table_index = undefined;

        if (table.id == 'room-table') {
            table_index = 1;
        }

        if (table.id == 'teacher-data-table') {
            table_index = 2;
            for (i of id('teacher-list-table').children) {
                i.parentElement.removeChild(i);
            }
            timesTeacherListOpen = 0;
        }

        if (table.id == 'subject-table') {
            table_index = 3;
            for (i of id('subject-list-table').children) {
                i.parentElement.removeChild(i);
            }
            timesSubjectListOpen
            = 0;
        }

        if (table.id == 'dept-table') {
            table_index = 4;
        }

        for (i in final_list[table_index]) {
            if (final_list[table_index][i][0] == deletion_id ) {
                deletion_index = i;
                break;
                console('it should be break');
            }

            console.log('loop');
        }
        deleted = final_list[table_index].splice(i, 1);

        console.log(table_index, deletion_id, deleted, final_list);

        setTimeout((row) => {tableBody.removeChild(row)}, 300, row);
    }

    // add row

    for (let i=0; i<byClass('add-row').length; i++) {

        byClass('add-row')[i].addEventListener('click', ()=> {

            button = byClass('add-row')[i];
            console.log(button, i);
            inputRow = byClass('add-row')[i].parentElement.parentElement;
            dataLen = inputRow.children.length - 1;
            let data_list = [];
            table = inputRow.parentElement;
            var row = cele('tr');
            table_index = null;
            if (table.parentElement.id == 'room-table') {table_index = 1}
            if (table.parentElement.id == 'teacher-data-table') {table_index = 2}

            match = final_list[table_index].every(findMatch);

            console.log(match, inputRow);

            function findMatch(row) {return row[0] != (inputRow.children[0].children[0]).value}

            if (match) {
                for (j=0; j<dataLen;j++) {
                console.log(value((inputRow.children[j].children[0])));
                if ((value((inputRow.children[j].children[0])) == '' || value(inputRow.children[j].children[0]) == undefined ) ) {
                    console.log('enter data properly');
                    return null;
                }
                
                data_list.push(value(inputRow.children[j].children[0]));
                const ele = cele('td');
                ele.innerHTML = value(inputRow.children[j].children[0]);
                inputRow.children[j].children[0].value = '';
                row.appendChild(ele);

                if (j+1 == dataLen) {
                    const ele = cele('td');
                    const btn = cele('button');
                    btn.addEventListener('click', removeRow);
                    btn.innerHTML = 'remove';
                    btn.classList.add('btn');
                    btn.classList.add('rem-row');
                    ele.appendChild(btn);
                    row.appendChild(ele);
                    // console.log(row.outerHTML);
                    table.insertBefore(row, inputRow);
                    // console.log(data_list, table.parentElement.id);

                    if (table.parentElement.id == 'room-table') {
                        final_list[1].push(data_list);
                    }

                    else if (table.parentElement.id == 'teacher-data-table') {
                        for (k of id('teacher-list-table').children) {
                            k.parentElement.removeChild(k);
                            // console.log(temp_list++);
                        }
                        final_list[2].push(data_list);
                        timesTeacherListOpen = 0;

                    }
                }

            }}
            else {
                console.log('data duplicate error'); 
                for (j=0; j<dataLen;j++) {
                    inputRow.children[j].children[0].value = '';
                }       }
            // console.log(data_list, table.outerHTML);


            

            
        });
    }


    

});


function reset_data() {

    id('mwf-start-time').value = '00:00';
  
    id('mwf-total-time').value = '0' ;
  
    id('mwf-class-duration').value = '0' ; 

    id('tts-start-time').value = '00:00' ;
  
    id('tts-total-time').value = '0' ;
  
    id('tts-class-duration').value = '0' ;

    tablebody = id('teacher-data-table').children[0];
    length = tablebody.children.length-2;
    console.log(length);
    for (let l = 1; l <= length; l++) {
        console.log(l, tablebody.children[1], tablebody.children.length, 1);
        tablebody.removeChild(tablebody.children[1]);
    }

    tablebody = id('room-table').children[0];
    length = tablebody.children.length-2;
    for (let l = 1; l <= length; l++) {
        console.log(l, tablebody.children[1], tablebody.children.length, 1);
        tablebody.removeChild(tablebody.children[1]);
    }

    tablebody = id('subject-table').children[0];
    length = tablebody.children.length-2;
    for (let l = 1; l <= length; l++) {
        console.log(l, tablebody.children[1], tablebody.children.length, 1);
        tablebody.removeChild(tablebody.children[1]);
    }

    tablebody = id('dept-table').children[0];
    length = tablebody.children.length-2;
    for (let l = 1; l <= length; l++) {
        console.log(l, tablebody.children[1], tablebody.children.length, 1);
        tablebody.removeChild(tablebody.children[1]);
    }
}


function child(element) {
    return element.childNodes();
}

function enable(button, event, func) {
    button.addEventListener(event, func);
}

function value(element) {
    return element.value.replace(/\s/g,'');
}

function cele(name){
    return document.createElement(name);
}

function id(name){
    return document.getElementById(name);
}

function byClass(name) {
    return document.getElementsByClassName(name);
}

function query(name, type='') {
    return document.querySelectorAll(type+name);
}
