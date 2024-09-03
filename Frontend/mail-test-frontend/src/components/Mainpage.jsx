import { useRef, useState } from "react";
import * as XLSX from 'xlsx';

const Mainpage = () => {

    // UseRef
    const titleRef = useRef();
    const subjectRef = useRef();

    // Onchange State
    const [excelFile, setExcelFile] = useState(null);
    const [typeError, setTypeError] = useState(null);

    // Onsubmit State
    const [excelData, setExcelData] = useState(null);

    // Onchange Event
    const handleFile = (e) => {
        let fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
        let selectedFile = e.target.files[0];
        if(selectedFile) {
            if(selectedFile&&fileTypes.includes(selectedFile.type)) {
                setTypeError(null);
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload=(e) => {
                    setExcelFile(e.target.result);
                }
            } else {
                setTypeError('Please select only excel file types!');
                setExcelFile(null);
            }
        } else {
            alert('Please upload your excel file');
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
            setExcelData(data.splice(0,10));
        }
        // excelData.map((eachData)=>(
        //     console.log(eachData)
        // ));
        console.log(excelData);
    }

    const sendMails = () => {
        alert(titleRef.current.value + ", " + subjectRef.current.value);
    }

  return (
    <div id="mainPage">
        <section className="container">
           <div className="row justify-content-center">
                <div className="col-lg-5 col-12 flex-column">
                    <div className="mb-3">
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text" id="addon-wrapping">Title</span>
                            <textarea ref={titleRef} type="text" className="form-control" placeholder="Title here" aria-label="Title here" aria-describedby="addon-wrapping" />
                        </div>
                    </div>
                    <div className="">
                        <div className="input-group flex-nowrap">
                            <span className="input-group-text" id="addon-wrapping">Subject</span>
                            <textarea ref={subjectRef} type="text" className="form-control" placeholder="Subject here" aria-label="Subject here" aria-describedby="addon-wrapping" />
                        </div>
                    </div>
                    <button onClick={sendMails} className="mt-3 btn btn-danger w-100">
                        <i className="bi bi-envelope-check-fill me-2"></i>
                        Send All Mails
                    </button>
                </div>
                <div className="col-lg-6 col-11">
                    <form onSubmit={handleFileSubmit}>
                        <div className="uploadBox mb-3">
                            <input className="form-control" type="file" id="formFile" required onChange={handleFile}/>
                            {typeError&&(
                                <div className="alert alert-danger mt-3" role="alert">{typeError}</div>
                            )}
                        </div>
                        <div className="d-flex gap-3">
                            <button type="submit" className="btn btn-success w-100">Upload</button>
                        </div>
                    </form>
                    <hr />
                    <div className="dataBox">
                        {excelData?(
                            <div className="table-responsive">
                                <table className="table">

                                    <thead>
                                        <tr>
                                            {Object.keys(excelData[0]).map((key)=>(
                                                <th key={key}>{key}</th>
                                            ))}
                                        </tr>
                                    </thead>

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