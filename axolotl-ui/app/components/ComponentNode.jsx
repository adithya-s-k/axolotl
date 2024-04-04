import React from "react"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import {useState} from 'react'
import { IoInformation } from "react-icons/io5"
import data from "../utils/hover-info.json"

function 	ComponentNode({ children, onChange }) {
	const [error, setError] = useState(null || String)
	const handleChangeData = (event) => {
	let newValue = event.target.value.trim()
	try{
		setError(null);
		if (newValue === "0"){
			onChange(newValue)
		}
		else if(newValue.length === String(eval(newValue)).length )
		onChange(eval(newValue))
		else
		onChange(newValue)
	}catch(err){
		setError(err);
		onChange(newValue)
		return null
	}
}

	if (
		typeof children === "string" ||
		typeof children === "number" ||
		typeof children === "boolean" ||
		children === null
	) {
		return (
			<>
				<input
					className="bg-slate-300 w-fit mt-3 border-black border-2 rounded-md p-2"
					type="text"
					value={children || ""}
					onChange={handleChangeData}
				/>
				<div className="px-2 pt-2 text-[1rem] text-red-600">
					{error && `${error}`}
				</div>
			</>
		)
	} else if (Array.isArray(children)) {
		return (
			<div>
				{children.map((value, index) => (
					<div key={index}>
						<Accordion
							type="single"
							collapsible
						
						>
							<AccordionItem value="item-1">
								<AccordionTrigger>[{index}]</AccordionTrigger>
								<AccordionContent>
									<ComponentNode
										children={value}
										onChange={(newValue) => {
											const newData = [...children];
											newData[index] = newValue;
											onChange(newData);
										}}
									/>
								</AccordionContent>
							</AccordionItem>
						</Accordion>	
					</div>
				))}
			</div>
		);
	} else if (typeof children === "object") {
		return (
			<div>
				{Object.entries(children).map(([key, value]) => (
					<div key={key}>
						<Accordion
							type="single"
							collapsible>
							<AccordionItem value="item-1">
								<AccordionTrigger>
									<div className="whitespace-nowrap">{key}</div>
									<div className="w-full group cursor-pointer justify-end flex">
										<IoInformation />
										<div className="hidden group-hover:block absolute text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded mt-2">
											{data[key]}
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<ComponentNode
										children={value}
										onChange={(newValue) =>
											onChange({ ...children, [key]: newValue })
										}
									/>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				))}
			</div>
		)
	} else {
		return null
	}
}

export default ComponentNode
