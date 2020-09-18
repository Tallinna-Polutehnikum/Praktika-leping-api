# Instructions



**To run the application locally, you have clone the repo onto your computer, navigate into the repo's directory and run the following commands.**

`npm install ` - Requires Node on your Computer, which includes the NPM package manager. Installs all required dependencies.

`npm start` or `node app.js`

After that go to the http://localhost:3000/ (if running on your computer) link to access the local instance.

To use the api, send a post request into the server with the required query parameters. The server will reply with the .docx file. 

| Query paramater | type | notes |
| :-- | :-: | :-- |
| company_address | string |
| company_city | string |
| company_contact_email | string | optional
| company_contact_name | string |
| company_contact_phone | number |
| company_contact_position | string |
| company_name | string |
| company_phone_number | number |
| company_reg_code | number |
| company_rep_name | string |
| company_rep_position | string |
| company_zipcode | number |
| contract_number | number |
| duration_hours | number |
| duration_weeks | number |
| practice_date_end | Date |
| practice_date_start | Date |
| school_address | string |
| school_city | string |
| school_contact_email | string | optional |
| school_contact_name | string |
| school_contact_phone | number |
| school_contact_position | string |
| school_info_bool | string | must be 'jah (läheb vormi lõppu)' to have tpt info |
| school_name | string | 
| school_phone | number |
| school_reg_code | number |
| school_rep_name | string |
| school_rep_position | string |
| school_zipcode | number |
| student_address | string |
| student_city | string |
| student_course | string |
| student_group | string |
| student_name | string |
| student_phone_number | number |
| student_zipcode | number  |

