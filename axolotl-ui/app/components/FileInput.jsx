import { useState } from "react"
import axios from "axios"
import { FileUploader } from "react-drag-drop-files"


export default function FileInput({ setYaml, setJson, upperFile, categorizeJSON }) {
	const fileTypes = ["YAML", "YML"]
	const [progress, setProgress] = useState({ started: false, pc: 0 })
	const [msg, setMsg] = useState(null)
	const handleFile = async (file) => {
		upperFile(file)
		handleUpload(file)
	}
	const handleUpload = (file) => {
		console.log(file)
		if (!file) {
			console.log("File not found")
			setMsg("File not selected")
			return
		}

		const fd = new FormData()
		fd.append("file", file)

		setMsg("Uploading...")
		setProgress((prevState) => ({
			...prevState,
			started: true,
		}))

		axios
			.post("/api/upload", fd, {
				onUploadProgress: (progressEvent) => {
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					)
					setProgress((prevState) => ({
						...prevState,
						pc: percentCompleted,
					}))
				},
				headers: {
					"Custom-Header": "value",
				},
			})
			.then((res) => {
				setMsg("Upload Successful")
				setYaml(res.data.yaml)
				setJson(categorizeJSON(JSON.parse(res.data.json)))
			})
			.catch((err) => {
				console.log(err)
				setMsg("Upload Failed")
			})
	}

	return (
		<div className="flex items-center">
			<div className="p-2">
				<div className="p-2">
					<FileUploader
						hoverTitle="Drop your files here"
						handleChange={handleFile}
						name="file"
						types={fileTypes}
					/>
				</div>

				{/* <button onClick={handleUpload}>Upload file</button> */}
				{/* {progress.started && (
					<progress
						className="w-full h-6"
						value={progress.pc}
						max="100"></progress>
				)} */}
			</div>
			{msg && <span className="w-[90%] mx-auto">{msg}</span>}
		</div>
	)
}
