/*
dbconfig.js

Sets the information needed by Oracle to connect to the database.
Protocol, host, port, etc. can be checked in SQLDeveloper by right
clicking on your Oracle Connection and choosing "Properties."

*/

module.exports = {
    user          : "dbteam1",
    password      : "password", 
    connectString : "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))" 
};