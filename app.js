const express = require('express')

const app = express();

var bodyParser = require('body-parser');

const path = require('path')
const port = process.env.PORT || 3000;
var fs = require('fs');

var ExportsDir = './exports'

if(!fs.existsSync(ExportsDir)){
    fs.mkdirSync(ExportsDir);
}

// Declare all of the variables coming in from the HTML Form.
// STUDENT
var Student_Name;
var Student_Phone;

var Student_Group;
var Student_Course;

var Student_Address;
var Student_ZipCode;
var Student_City;

// CONTRACT DETAILS
var ContractNumber;
var Practice_DateStart;
var Practice_DateEnd;

var StartYear;
var EndYear;

var DurationWeeks;
var DurationHours;

//COMPANY
var Company_Name;
var Company_Address;
var Company_ZipCode;
var Company_City;

var Company_RegCode;
var Company_Phone;

var Company_RepName;
var Company_RepPosition;

var Company_ContactName;
var Company_ContactPosition;
var Company_ContactPhone;
var Company_ContactEmail;

//SCHOOL
var School_Name = "Tallinna Polütehnikum";
var School_Address = "Pärnu mnt 57";
var School_ZipCode = "10135";
var School_City = "Tallinn";

var School_RegCode = "70003974";
var School_Phone = "610 3601";

var School_RepName = "Lembit Kukk";
var School_RepPosition = "Praktikajuht";

var School_ContactName;
var School_ContactPosition;
var School_ContactPhone;
var School_ContactEmail;

//DATES
var Initialize_Date = new Date();
var FINDDATE = Initialize_Date.getMonth();

const months_1 = ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli',
    'august', 'september', 'oktoober', 'november', 'detsember',
];

const months_2 = ['jaanuaril', 'veebruaril', 'märtsil', 'aprillil ', 'mail', 'juunil',
    'juulil', 'augustil', 'septembril', 'oktoobril', 'novembril', 'detsembril',
];

var CurrentMonth = months_1[FINDDATE];
var CurrentDay = Initialize_Date.getDate();
var CurrentYear = Initialize_Date.getFullYear();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('resources'));

app.post('/devtest',function(req,res){

    res.send("this is what i got: ");

})
app.post('/', function (req,res) {

    //Student
    Student_Name = req.query.student_name;
    Student_Phone = req.query.student_phone_number;

    Student_Group = req.query.student_group;
    Student_Course = req.query.student_course;

    Student_Address = req.query.student_address;
    Student_ZipCode = req.query.student_zipcode;
    Student_City = req.query.student_city;

    //Contract Details
    ContractNumber = req.query.contract_number;

    var UserInput_StartDates = req.query.practice_date_start;
    var StartDates = UserInput_StartDates.split("-");

    var LocateStartMonth = StartDates[1] - 1;
    var StartMonthToText = months_2[LocateStartMonth];

    Practice_DateStart = `” ` + StartDates[2] +  ` ”` + ` ` + StartMonthToText + ` ` + StartDates[0] + ` a.`;
    console.log(Practice_DateStart)

    var UserInput_EndDates = req.query.practice_date_end;
    var EndDates = UserInput_EndDates.split("-");

    var LocateEndMonth = EndDates[1] - 1;
    var EndMonthToText = months_2[LocateEndMonth];

    Practice_DateEnd = `” ` + EndDates[2] +  ` ”` + ` ` + EndMonthToText + ` ` + EndDates[0] + ` a.`;
    console.log(Practice_DateEnd)

    StartYear = StartDates[0];
    EndYear = EndDates[0];

    DurationWeeks = req.query.duration_weeks;
    DurationHours = req.query.duration_hours;

    //Company
    Company_Name = req.query.company_name;
    Company_Address = req.query.company_address;
    Company_ZipCode = req.query.company_zipcode;
    Company_City = req.query.company_city;

    Company_RegCode = req.query.company_reg_code;
    Company_Phone = req.query.company_phone_number;

    Company_RepName = req.query.company_rep_name;
    Company_RepPosition = req.query.company_rep_position;

    //School
    if(req.query.school_info_bool != "jah (läheb vormi lõppu)")
    {
        School_Name = req.query.school_name;
        School_Address = req.query.school_address;
        School_ZipCode = req.query.school_zip;
        School_City = req.query.school_city;

        School_RegCode = req.query.school_reg_code;
        School_Phone = req.query.school_phone_number;

        School_RepName = req.query.school_rep_name;
        School_RepPosition = req.query.school_rep_position;
    }


    School_ContactName = req.query.school_contact_name;
    School_ContactPosition = req.query.school_contact_position;
    School_ContactPhone = req.query.school_contact_phone;

    if(req.query.school_contact_email == "")
    {
        School_ContactEmail = "";
    }
    else if(req.query.school_contact_email == undefined)
    {
        School_ContactEmail = "";
    }
    else{
        School_ContactEmail = "e-post " + req.query.school_contact_email;
    }



    Company_ContactName = req.query.company_contact_name;
    Company_ContactPosition = req.query.company_contact_position;
    Company_ContactPhone = req.query.company_contact_phone;
    if(req.query.company_contact_email != "" && req.query.company_contact_email != null)
        Company_ContactEmail = "e-post " + req.query.company_contact_email;
    else Company_ContactEmail = "";

    try
    {

        GenerateFile()
        res.download(path.join(__dirname, '/exports/finalizedContract.docx'));;
    }
    catch
    {
        res.send("error in creating the file")
    }


})

app.listen(port, () => console.log(`Application is listening at http://localhost:${port}`))


function GenerateFile() {

    var PizZip = require('pizzip');
    var Docxtemplater = require('docxtemplater');

    const libre = require('libreoffice-convert');


    // The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
    function replaceErrors(key, value) {
        if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function(error, key) {
                error[key] = value[key];
                return error;
            }, {});
        }
        return value;
    }

    function errorHandler(error) {
        console.log(JSON.stringify({error: error}, replaceErrors));

        if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors.map(function (error) {
                return error.properties.explanation;
            }).join("\n");
            console.log('errorMessages', errorMessages);
            // errorMessages is a humanly readable message looking like this :
            // 'The tag beginning with "foobar" is unopened'
        }
        throw error;
    }

    //Load the docx file as a binary
    var content = fs.readFileSync(path.resolve(__dirname, 'praktikaleping_template.docx'), 'binary');

    var zip = new PizZip(content);
    var doc;
    try {
        doc = new Docxtemplater(zip);
    } catch(error) {
        // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
        errorHandler(error);
    }

    //set the templateVariables
    doc.setData({

        //Student
        student_name: Student_Name,
        student_phone_number: Student_Phone,

        student_group: Student_Group,
        student_course: Student_Course,

        student_address: Student_Address,
        student_zip: Student_ZipCode,
        student_city: Student_City,

        //Practice Details,
        contract_number: ContractNumber,
        practice_date_start: Practice_DateStart,
        practice_date_end: Practice_DateEnd,

        start_year: StartYear,
        end_year: EndYear,

        duration_weeks: DurationWeeks,
        duration_hours: DurationHours,

        //Company
        company_name: Company_Name,
        company_address: Company_Address,
        company_zip: Company_ZipCode,
        company_city: Company_City,

        company_reg_code: Company_RegCode,
        company_phone_number: Company_Phone,

        company_rep_name: Company_RepName,
        company_rep_position: Company_RepPosition,

        company_contact_name: Company_ContactName,
        company_contact_position: Company_ContactPosition,
        company_contact_phone: Company_ContactPhone,
        company_contact_email: Company_ContactEmail,

        //School
        school_name: School_Name,
        school_address: School_Address,
        school_zip: School_ZipCode,
        school_city: School_City,

        school_reg_code: School_RegCode,
        school_phone_number: School_Phone,

        school_rep_name: School_RepName,
        school_rep_position: School_RepPosition,

        school_contact_name: School_ContactName,
        school_contact_position: School_ContactPosition,
        school_contact_phone: School_ContactPhone,
        school_contact_email: School_ContactEmail,

        //Date
        current_day: CurrentDay,
        current_month: CurrentMonth,
        current_year: CurrentYear,

    });

    try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render()
    }
    catch (error) {
        // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
        errorHandler(error);
    }

    var buf = doc.getZip().generate({type: 'nodebuffer'});

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.

    fs.writeFileSync(path.resolve(__dirname, 'exports/finalizedContract.docx'), buf);

    if(fs.existsSync('/exports/praktikaleping_template.pdf'))
    {
        fs.unlinkSync('/exports/praktikaleping_template.pdf');
    }

    var extend = '.pdf'
    var enterPath = path.join(__dirname, '/exports/finalizedContract.docx');
    var outputPath = path.join(__dirname, `/exports/finalizedContract${extend}`);

    enterPath = fs.readFileSync(enterPath);
    libre.convert(enterPath, extend, undefined, (err, done) => {
        if (err) {
            console.log(`Error converting file: ${err}`);
        }

        fs.writeFileSync(outputPath, done);
    });

    return buf;
}

function ClearExports() {
    const directory = 'exports';

    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
}

