import { useRef, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import './Mainpage.css';
import axios from 'axios';

const Mainpage = () => {

    // UseRef
    const titleRef = useRef();
    const subjectRef = useRef();

    // Onchange State
    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);

    // Onsubmit State
    const [excelData, setExcelData] = useState(null);
    const [originFile, setOriginFile] = useState(null);

    // Ref for file input
    const fileInputRef = useRef(null);

    // Onchange Event
    const handleFile = (e) => {
        let fileTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv'
        ];
        
        let selectedFile = e.target.files[0];
        setOriginFile(selectedFile);

        if (selectedFile) {
            if (fileTypes.includes(selectedFile.type)) {
                setTypeError(null);  // Clear any previous error message
    
                const reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
    
                reader.onload = (e) => {
                    setExcelFile(e.target.result);  // Set the file content to state
                };
    
                reader.onerror = () => {
                    setTypeError('There was an error reading the file.');  // Handle file reading errors
                    setExcelFile(null);
                };
            } else {
                setTypeError('Please select only Excel file types!');
                setExcelFile(null);  // Clear the previously selected file
                setOriginFile(null);  // Clear original file if not valid
            }
        } else {
            Swal.fire({
                title: "No File Uploaded!",
                text: "Please upload your excel file.",
                icon: "error",
                customClass: {
                    confirmButton: "customSuccessBtn"
                }
            });
            setExcelData(null);
            setOriginFile(null);  // Clear original file if no file selected
        }
    }

    // Submit Event
    const handleFileSubmit = (e) => {
        e.preventDefault();
        if(excelFile!==null) {
            const workBook = XLSX.read(excelFile, {type: 'buffer'})
            const workSheetName = workBook.SheetNames[0];
            const workSheet = workBook.Sheets[workSheetName];
            const data = XLSX.utils.sheet_to_json(workSheet);
            // Replace the original key with 'mail'
            const modifiedData = data.map(row => {
                const newRow = {};
                Object.keys(row).forEach(key => {
                    newRow['Mail'] = row[key]; 
                });
                return newRow;
            });
            setExcelData(modifiedData);
        }
        console.log(excelData);
    }

    const totalMails = [];

    // Sending mail function
    const sendMails = () => {
        const originalBody = subjectRef.current.value;
        const formattedBody = originalBody.replace(/\n/g, '<br>');
        axios.put('http://localhost:8080/mail/sendmail', {
            title: titleRef.current.value,
            subject: formattedBody,
            bccRecipients: totalMails
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Mail sent successfully:', response.data);
        })
        .catch(error => {
            console.error('Error sending mail:', error.response.data); // Handle the error
        });
    }

    const confirmMails = () => {
        if(!fileInputRef.current.value) {
            Swal.fire({
                title: "No File Uploaded!",
                text: "Excel File ကိုအရင်ရွေးပေးပါ",
                icon: "error",
                customClass: {
                    confirmButton: "customSuccessBtn"
                }
            });
        } else if(excelData===null) {
            Swal.fire({
                title: "Click upload first!",
                text: "File ရွေးပြီးရင် Upload ဆိုတဲ့ button လေးကိုအရင်နှိပ်ပေးပါ",
                icon: "info",
                customClass: {
                    confirmButton: "customSuccessBtn"
                }
            });
        } else {
            if(titleRef.current.value==="" || subjectRef.current.value==="") {
                Swal.fire({
                    title: "Missing Informations",
                    text: "Mail ပို့ရန် Title နဲ့ Subject တွေထည့်ပေးပါ",
                    icon: "error",
                    customClass: {
                        confirmButton: "customSuccessBtn"
                    }
                });
            } else {
                Swal.fire({
                    title: "Are you sure?",
                    text: "Mail တွေ ပို့တော့မှာသေချာပြီလား?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#198754",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Send",
                    reverseButtons: true,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire({
                        title: "Success!",
                        text: "Mail တွေအကုန် ပို့လိုက်ပါပြီ",
                        icon: "success",
                        customClass: {
                            confirmButton: "customSuccessBtn"
                        }
                      });
                      sendMails();
                    }
                  });
                Object.keys(excelData).map((eachData)=> {
                    console.log(eachData);
                })
                console.log(excelData[0]["Mail"]);
                console.log(excelData);
                Object.keys(excelData).map((eachData)=>{
                    totalMails.push(excelData[eachData]["Mail"]);
                    console.log(excelData[eachData]["Mail"]);
                    console.log(typeof(excelData[eachData]["Mail"]));
                })
                console.log(totalMails);
            }
        }
    }

    const cancelAllMails = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Excel File နဲ့ အထဲက Mail တွေကို မပို့တော့မှာသေချာပါသလား?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#000",
            confirmButtonText: "Delete",
            reverseButtons: true,
          }).then((result) => {
            if (result.isConfirmed) {
                setExcelData(null);
                setExcelFile(null);
                setOriginFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Clear the file input
                }
              Swal.fire({
                title: "Success!",
                text: "ပို့ချင်တဲ့ Mail တွေအကုန် Cancel လိုက်ပါပြီ",
                icon: "success",
                customClass: {
                    confirmButton: "customSuccessBtn"
                }
              });
            }
          });
          
    }

  return (
    <div id="mainPage">
        <section className="container py-4">
           <div className="row justify-content-center">
                <div className="col-lg-5 col-12 flex-column mb-5 mb-lg-0">
                    <div className="mb-3">
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text" id="addon-wrapping">Title</span>
                            <textarea ref={titleRef} type="text" className="form-control" placeholder="Title here . . ." aria-label="Title here" aria-describedby="addon-wrapping" required />
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="">
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text" id="addon-wrapping">Subject</span>
                            <textarea style={{height: 340}} ref={subjectRef} type="text" className="form-control" placeholder="Subject here . . ." aria-label="Subject here" aria-describedby="addon-wrapping" required />
                        </div>
                    </div>
                    <button onClick={confirmMails} className="mt-3 btn btn-success w-100">
                        <i className="bi bi-envelope-check-fill me-2"></i>
                        Send All Mails
                    </button>
                </div>
                <div className="col-lg-6 col-11">
                    <form onSubmit={handleFileSubmit}>
                        <div className="uploadBox mb-3">
                            <input ref={fileInputRef} className="form-control" type="file" id="formFile" required onChange={handleFile}/>
                            {typeError&&(
                                <div className="alert alert-danger mt-3" role="alert">{typeError}</div>
                            )}
                        </div>
                        {originFile && (
                            <div className="d-flex gap-3">
                                <button type="submit" className="btn btn-success w-100">Upload</button>
                            </div>
                        )}
                    </form>
                    <hr />
                    <div className="dataBox">
                        {excelData?(
                            <div className="table-responsive">
                                <table className="table table-striped">

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <button className="btn btn-sm btn-danger" onClick={cancelAllMails}><strong style={{backgroundColor: "unset"}} className="text-white">Delete File</strong></button>
                                        <p className="mb-0">Total Mails :<span className="text-danger" style={{backgroundColor: "unset"}}>{excelData.length}</span></p>
                                    </div>

                                    <tbody>
                                        {excelData.map((eachData, index)=>(
                                            <tr className="small" key={index}>{Object.keys(eachData).map((key)=>(
                                                <td key={key}>{eachData[key]}</td>
                                            ))}</tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        ) : (
                            <div>No file is uploaded yet!</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Mainpage