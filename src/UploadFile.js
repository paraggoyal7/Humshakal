import React, {useState} from 'react';
import Button from '@material-ui/core/Button';

const UploadFile = () => {

  const [selectedFile, setSelectedFile] = useState();
	const [isSelected, setIsSelected] = useState(false);

  	const changeHandler = (event) => {
  		setSelectedFile(event.target.files[0]);
      console.log(event.target.files[0]);
  		setIsSelected(true);
  	};

  	const handleSubmission = () => {
      const formData = new FormData();

  		formData.append('File', selectedFile);
      console.log(formData, selectedFile);
  	};

  	return(
     <div>
       <input
         type="file"
         accept="text/csv"
         style={{ display: 'none' }}
         id="contained-button-file"
         onChange={changeHandler}
       />
         <label htmlFor="contained-button-file">
           <Button variant="contained" color="primary" component="span">
             Upload
           </Button>
         </label>
      {isSelected ? (
			<div>
				<p>Filename: {selectedFile.name}</p>
				<p>Filetype: {selectedFile.type}</p>
				<p>Size in bytes: {selectedFile.size}</p>
				<p>
					lastModifiedDate:{' '}
					{selectedFile.lastModifiedDate.toLocaleDateString()}
				</p>
			</div>
		) : (
			<p>Select a file to show details</p>
		)}
			<div>
				<button onClick={handleSubmission}>Submit</button>
			</div>
		</div>
  	)
}

export default UploadFile;
