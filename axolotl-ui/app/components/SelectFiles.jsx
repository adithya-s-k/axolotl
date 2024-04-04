import React, { useState } from "react"
import axios from 'axios'
const files = [
	{ label: "cerebras", value: '["btlm-ft", "qlora"]' },
	{
		label: "code-llama",
		value:
			'{"13b": ["lora", "qlora"], "34b": ["lora", "qlora"], "7b": ["lora", "qlora"]}',
	},
	{
		label: "falcon",
		value: '["config-7b-lora", "config-7b-qlora", "config-7b"]',
	},
	{ label: "gemma", value: '["qlora"]' },
	{ label: "gptj", value: '["qlora"]' },
	{ label: "jeopardy-bot", value: '["config"]' },
	{
		label: "llama-2",
		value:
			'["fft_optimized", "gptq-lora", "loftq", "lora", "qlora-fsdp", "qlora", "relora"]',
	},
	{ label: "mamba", value: '["config"]' },
	{
		label: "mistral",
		value:
			'{"mistral-7b-example": ["config", "lora-mps", "mixtral-qlora-fsdp", "mixtral", "qlora"]}',
	},
	{ label: "mpt-7b", value: '["config"]' },
	{ label: "openllama-3b", value: '["config", "lora", "qlora"]' },
	{ label: "phi", value: '["phi-ft", "phi-qlora", "phi-qlora", "phi2-ft"]' },
	{ label: "pythia-12b", value: '["config"]' },
	{ label: "pythia", value: '["lora"]' },
	{ label: "qwen", value: '["lora", "qlora"]' },
	{ label: "redpajama", value: '["config-3b"]' },
	{ label: "replit-3b", value: '["config-lora"]' },
	{ label: "stablelm-2", value: '["1.6b"]' },
	{ label: "starcoder2", value: '["qlora"]' },
	{ label: "tiny-llama", value: '["lora-mps", "lora", "pretrain", "qlora"]' },
	{ label: "xgen-7b", value: '["xgen-7b-8k-qlora"]' },
	{ label: "yi-34B-chat", value: '["qlora"]' },
]

export const SelectFiles = ({ setJson, setFile, categorizeJSON }) => {
	const [selectedFile, setSelectedFile] = useState({
		first: "",
		second: "",
		third: "",
	})
	const [second, setSecond] = useState([])
	const [third, setThird] = useState([])
	const [submit, isSubmit] = useState(false)

	const handleLoad = async () => {
		if (selectedFile.third) {
			await axios
				.post(
					"/api/load",
					{
						file_url: `${selectedFile.first}/${selectedFile.second}/${selectedFile.third}`,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				)
				.then((res) => {
					setJson(categorizeJSON(JSON.parse(res.data.json)))
					setFile({
						name: selectedFile.third + ".yml",
					})
				})
				.catch((err) => {
					console.log("Error:" + err)
				})
		} else {
			await axios
				.post(
					"/api/load",
					{
						file_url: `${selectedFile.first}/${selectedFile.second}`,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				)
				.then((res) => {
					setJson(categorizeJSON(JSON.parse(res.data.json)))
					setFile({
						name: selectedFile.second + ".yml",
					})
				})
				.catch((err) => {
					console.log("Error:" + err)
				})
		}
	}

	const handleChange1 = (e) => {
		const selectedLabel = e.target.value
		const selectedLanguage = files.find((lang) => lang.label === selectedLabel)
		setSecond([])
		setThird([])
		setSelectedFile({
			...selectedFile,
			first: selectedLanguage.label,
			second: "",
			third: "",
		})
		if (selectedLanguage) {
			if (Array.isArray(JSON.parse(selectedLanguage.value))) {
				console.log(JSON.parse(selectedLanguage.value))
				setSelectedFile({
					...selectedFile,
					first: selectedLanguage.label,
					second: JSON.parse(selectedLanguage.value)[0],
					third: "",
				})
				setSecond(JSON.parse(selectedLanguage.value))
				setThird([])
			} else {
				const values = JSON.parse(selectedLanguage.value)
				setSecond(Object.keys(values))
				setSelectedFile({
					...selectedFile,
					first: selectedLanguage.label,
					second: Object.keys(values)[0],
					third: "",
				})
				setThird([])
			}
		} else {
			setSecond([])
			setThird([])
		}
	}

	const handleChange2 = (e) => {
		const secondValue = e.target.value
		const selectedLabel = selectedFile.first
		const selectedLanguage = files.find(
			(items) => items.label === selectedLabel
		)
		if (!selectedLanguage) {
			setThird([])
		}
		if (selectedLanguage) {
			const selectedValue = JSON.parse(selectedLanguage.value)
			setSelectedFile({ ...selectedFile, second: secondValue, third: "" })
			if (Array.isArray(selectedValue)) {
				isSubmit(true)
			} else {
				isSubmit(false)
				console.log(typeof selectedValue)
				console.log(selectedValue, secondValue)
				console.log(selectedValue[secondValue])
				setThird(selectedValue[secondValue])
			}
		} else {
			setThird([])
		}
	}

	const handleChange3 = (e) => {
		const selectedLabel = e.target.value
		setSelectedFile({ ...selectedFile, third: selectedLabel })
		isSubmit(true)
	}
	const handleSubmit = (e) => {}
	console.log(selectedFile)
	return (
		<div className="flex pt-10 pl-2 relative ">
			<select
				onChange={handleChange1}
				className="text-black  rounded-lg mr-4 px-8 py-[0.7rem] border-gray-300 border-4  ">
				<option
					value=""
					selected>
					Select a option
				</option>
				{files.map((items, index) => (
					<option
						value={items.label}
						key={index}>
						{items.label}
					</option>
				))}
			</select>
			{second.length !== 0 && (
				<select
					onChange={handleChange2}
					className="text-black rounded-lg mr-2 px-2 border-gray-300 border-4 ">
					<option
						value="-1"
						selected>
						Select a option
					</option>
					{Array.isArray(second) &&
						second.map((items, index) => (
							<option
								value={items}
								key={index}>
								{items}
							</option>
						))}
				</select>
			)}
			{third.length !== 0 && (
				<select
					onChange={handleChange3}
					className="text-black rounded-lg mr-2 px-2 border-gray-300 border-4 ">
					<option
						value=""
						selected>
						Select a value
					</option>
					{third.map((items, index) => (
						<option
							value={items}
							key={index}>
							{items}
						</option>
					))}
				</select>
			)}
			{submit && (
				<div
					onClick={handleLoad}
					className="w-fit  cursor-pointer  px-[1.5rem] h-fit p-2 hover:bg-gray-700 rounded-xl ml-4 bg-[#0F172A]  text-white font-bold">
					Load
				</div>
			)}
			{!submit && (
				<div className="w-fit  cursor-pointer px-[1.5rem] h-fit p-2 hover:bg-gray-700 flex items-center rounded-xl ml-4 bg-[#0F172A]  text-white font-bold">
					Load
				</div>
			)}
		</div>
	)
}
