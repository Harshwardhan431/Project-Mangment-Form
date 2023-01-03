/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL='http://api.login2explore.com:5577';
var jpdbIRL='/api/irl';
var jpdbIML='/api/iml';
var empDBName='COLLEGE-DB';
var empRelationName="PROJECT-TABLE";
var connToken="90938187|-31949272820595201|90954792";

$('#projid').focus();

function saveRecNo2LS(jsonObj){
    var lvData=JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getEmpIdAsJsonObj(){
    var projid=$('#projid').val();
    var jsonStr={
        id:projid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var data=JSON.parse(jsonObj.data).record;
    $('#projName').val(data.name);
    $('#projAssgTo').val(data.AssignedTo);
    $('#projAssDate').val(data.AssignedDate);
    $('#projDeadline').val(data.Deadline);
}

function resetProject(){
    $('#projid').val("");
    $('#projName').val("");
    $('#projAssgTo').val("");
    $('#projAssDate').val("");
    $('#projDeadline').val("");
    $('#projid').prop("disabled",false);
    $('#projSave').prop('disabled',true);
    $('#projChange').prop('disabled',true);
    $('#projReset').prop('disabled',true);
    $('#projid').focus();
}

function saveProject(){
    var jsonStrObj=validateData();
    if (jsonStrObj===''){
        return "";
    }
    var putRequest=createPUTRequest(connToken,jsonStrObj,empDBName,empRelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj=executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetEmployee();
    $('#projid').focus();
}

function validateData(){
    var projid,projname,assgTo,assgDate,deadline;
    projid=$('#projid').val();
    projname=$('#projName').val();
    assgTo=$('#projAssgTo').val();
    assgDate=$('#projAssDate').val();
    deadline=$('#projDeadline').val();
    
    if (projid==='')
    {
        alert('Project ID missing');
        $('#projid').focus();
        return "";
    }
    if (projname===""){
        alert('Project name missing');
        $('#projName').focus();
        return "";
    }
    if (assgTo===""){
        alert('Project Assigned To missing');
        $('#projAssgTo').focus();
        return "";
    }
    if (assgDate===""){
        alert('Project Assigned Date missing');
        $('#projAssDate').focus();
        return "";
    }
    if (deadline===""){
        alert('Project Deadline missing');
        $('#projDeadline').focus();
        return "";
    }
    
    var jsonStrObj={
      id:projid,
      name:projname,
      AssignedTo:assgTo,
      AssignedDate:assgDate,
      Deadline:deadline
    };
    return JSON.stringify(jsonStrObj);
}

function changeProject(){
    $('#projChange').prop("disabled",true);
    jsonChg=validateData();
    var updateRequest=createUPDATERecordRequest(connToken,jsonChg,empDBName,empRelationName
            ,localStorage.getItem('recno'));
            jQuery.ajaxSetup({async:false});
            var resJsonObj=executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
            jQuery.ajaxSetup({async:true});
            console.log(resJsonObj);
            resetForm();
            $('#projid').focus();
}

function getProj(){
    var empIdJsonObj=getEmpIdAsJsonObj();
    var getRequest=createGET_BY_KEYRequest(connToken,empDBName,empRelationName,empIdJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj=executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if (resJsonObj.status===400){
        $('#projSave').prop('disabled',false);
        $('#projReset').prop('disabled',false);
        $('#projName').focus();
    }else if (resJsonObj.status===200)
    {
        $('#projid').prop('disabled',true);
        fillData(resJsonObj);
        $('#projChange').prop('disabled',false);
        $('#projReset').prop('disabled',false);
        $('#projName').focus();
    }
}