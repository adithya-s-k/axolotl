import React from 'react'
import YamlEditor from "@focus-reactive/react-yaml"
import {useRef, useEffect} from 'react'

function Editor({ jsonContent, isLoaded, setJson, categorizeJSON }) {
	const handleChange = ({ json, text }) => {
		setJson(categorizeJSON(json))
	}
	if (isLoaded) {
		return (
			<div className="w-[47%]   mx-auto  pb-[3rem] h-[86vh] overflow-auto rounded-xl mt-8  fixed bg-[#D9D9D9] border-4 border-gray-300 ">
				<YamlEditor
					onChange={handleChange}
					text="# Yaml code editor
					 Please Upload Your File to Edit"
				/>
			</div>
		)
	}
	const actions = useRef(null)
	function flattenConfiguredJson(configuredJson) {
		const flattenedJson = {}

		for (const config in configuredJson) {
			for (const key in configuredJson[config]) {
				flattenedJson[key] = configuredJson[config][key]
			}
		}

		return flattenedJson
	}

	useEffect(() => {
		if(jsonContent){
		const flattenedJson = flattenConfiguredJson(jsonContent)
		console.log(jsonContent)
		console.log(JSON.stringify(flattenedJson, null, 2))
		actions.current.replaceValue({ json: flattenedJson })
		}
	}, [jsonContent])


	if (isLoaded) return <>Loading...</>

	return (
		<div className="w-[47%]   mx-auto  pb-[3rem] h-[84vh] overflow-auto rounded-xl mt-8  fixed bg-[#D9D9D9] border-2 border-black  ">
			<YamlEditor
				onChange={handleChange}
				ref={actions}
				json={flattenConfiguredJson(jsonContent)}
			/>
		</div>
	)
}

export default Editor