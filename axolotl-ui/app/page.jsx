"use client"
import {SelectFiles} from './components/SelectFiles'
import Editor from "./components/Editor";
import FileInput from "./components/FileInput";
import {useState, useEffect} from 'react'
import RenderedComponents from './components/RenderedComponents'
import { isEqual } from "lodash"
import axios from 'axios'
import preset from "./utils/preset-yaml.json"



export default function Home() {
	const [yaml, setYaml] = useState("")
	const [json, setJson] = useState({})
	const [file, setFile] = useState("")
	useEffect(() => {
		setJson(categorizeJSON(preset))
	}, [])
	function flattenConfiguredJson(configuredJson) {
			const flattenedJson = {}

			for (const config in configuredJson) {
				for (const key in configuredJson[config]) {
					flattenedJson[key] = configuredJson[config][key]
				}
			}

			return flattenedJson
		}
		
	const configKeys = {
	"Model Configuration": [
		"base_model",
		"base_model_ignore_patterns",
		"base_model_config",
		"revision_of_model",
		"tokenizer_config",
		"model_type",
		"trust_remote_code",
		"is_falcon_derived_model",
		"is_llama_derived_model",
		"is_qwen_derived_model",
		"is_mistral_derived_model",
		"overrides_of_model_config",
	],
	"Tokenizer Configuration": [
		"tokenizer_type",
		"tokenizer_use_fast",
		"tokenizer_legacy",
		"resize_token_embeddings_to_32x",
	],
	"Quantization Configuration": [
		"bnb_config_kwargs",
		"gptq",
		"load_in_8bit",
		"load_in_4bit",
		"bf16",
		"fp16",
		"tf32",
		"bfloat16",
		"float16",
		"gpu_memory_limit",
		"lora_on_cpu",
	],
	"Lora Configuration": [
		"relora_steps",
		"relora_warmup_steps","relora_anneal_steps",
		"relora_prune_ratio",
		"relora_cpu_offload",
		"adapter",
		"lora_model_dir",
		"lora_r",
		"lora_alpha",
		"lora_dropout",
		"lora_target_modules",
		"lora_target_linear",
		"peft_layers_to_transform",
		"lora_modules_to_save",
		"lora_fan_in_fan_out",
		"peft",
		"bnb_config_kwargs",
	],
	"WandB and Mlflow Configuration": [
		"wandb_mode",
		"wandb_project",
		"wandb_entity",
		"wandb_watch",
		"wandb_name",
		"wandb_run_id",
		"wandb_log_model",
		"mlflow_tracking_uri",
		"mlflow_experiment_name",
		"hf_mlflow_log_artifacts",
	],
	"Training Configuration": [
		"save_safetensors",
		"lr_div_factor",
		"optim_target_modules",
		"output_dir",
		"torch_compile",
		"torch_compile_backend",
		"gradient_accumulation_steps",
		"micro_batch_size",
		"eval_batch_size",
		"num_epochs",
		"warmup_steps",
		"warmup_ratio",
		"learning_rate",
		"lr_quadratic_warmup",
		"logging_steps",
		"eval_steps",
		"evals_per_epoch",
		"save_strategy",
		"save_steps",
		"saves_per_epoch",
		"save_total_limit",
		"max_steps",
		"eval_table_size",
		"eval_max_new_tokens",
		"eval_causal_lm_metrics",
		"loss_watchdog_threshold",
		"loss_watchdog_patience",
		"train_on_inputs",
		"group_by_length",
		"gradient_checkpointing",
		"gradient_checkpointing_kwargs",
		"early_stopping_patience",
		"lr_scheduler",
		"lr_scheduler_kwargs",
		"cosine_min_lr_ratio",
		"cosine_constant_lr_ratio",
		"optimizer",
		"optim_args",
		"weight_decay",
		"adam_beta1",
		"adam_beta2",
		"adam_epsilon",
		"max_grad_norm",
		"neftune_noise_alpha",
		"flash_optimum",
		"xformers_attention",
		"flash_attention",
		"flash_attn_cross_entropy",
		"flash_attn_rms_norm",
		"flash_attn_fuse_qkv",
		"flash_attn_fuse_mlp",
		"sdp_attention",
		"s2_attention",
		"resume_from_checkpoint",
		"auto_resume_from_checkpoints",
		"local_rank",
		"special_tokens",
		"tokens",
	],
	"Distributed training configuration": [
		"fsdp",
		"fsdp_config",
		"deepspeed",
		"ddp_timeout",
		"ddp_bucket_cap_mb",
		"ddp_broadcast_buffers",
		"torchdistx_path",
		"pretraining_dataset",
		"debug",
		"seed",
		"strict",
	],
	"Dataset Configuration": [
		"datasets",
		"shuffle_merged_datasets",
		"test_datasets",
		"rl",
		"chat_template",
		"default_system_message",
		"dataset_prepared_path",
		"push_dataset_to_hub",
		"dataset_processes",
		"dataset_keep_in_memory",
		"hub_model_id",
		"hub_strategy",
		"hf_use_auth_token",
		"val_set_size",
		"dataset_shard_num",
		"dataset_shard_idx",
		"sequence_len",
		"pad_to_sequence_len",
		"sample_packing",
		"eval_sample_packing",
		"sample_packing_eff_est",
		"total_num_tokens",
		"device_map",
		"max_memory",
	],
	}
	const categorizeJSON = (inputJson) => {
		let categorizedJson = {}
		Object.entries(inputJson).forEach(([key, value]) => {
			let belongsToConfig = false

			Object.entries(configKeys).forEach(([config, keys]) => {
				if (keys.includes(key)) {
					if (!categorizedJson[config]) {
						categorizedJson[config] = {}
					}
					categorizedJson[config][key] = value
					belongsToConfig = true
				}
			})

			if (!belongsToConfig) {
				categorizedJson[key] = value
			}
		})

		return categorizedJson
	}

	async function downloadFile() {
		try {
			console.log(file)
			const response = await axios.post(
				"/api/download",
				{
					json: flattenConfiguredJson(json),
					file_name: file.name,
				},
				{
					responseType: "blob",
				}
			)

			const url = window.URL.createObjectURL(response.data)

			const link = document.createElement("a")
			link.href = url
			link.download = file.name
			document.body.appendChild(link)
			link.click()

			window.URL.revokeObjectURL(url)
			document.body.removeChild(link)
		} catch (error) {
			console.error("Error downloading file:", error)
		}
	}
	const isLoaded = isEqual(json, {});
  return (
		<div className="w-full h-[100vh] flex gap-[2.5rem]  text-lg">
			<div className=" w-[50%] mt-4 ml-5  ">
				<div>
					<h1 className="text-4xl">YAML Editor</h1>
				</div>
				<div className="text-white text-[1rem]">
					<SelectFiles
						setFile={setFile}
						isLoaded={isLoaded}
						setJson={setJson}
						categorizeJSON={categorizeJSON}
					/>
				</div>

				<RenderedComponents
					isLoaded={isLoaded}
					setJson={setJson}
					jsonContent={json}
				/>
			</div>
			<div className="flex justify-between w-[50%]">
				<Editor
					setJson={setJson}
					isLoaded={isLoaded}
					jsonContent={json}
					categorizeJSON={categorizeJSON}
				/>
				<div className="pt-4 items-center absolute bottom-1 w-[45%] pr-2  flex justify-between">
					<div className="flex items-center">
						<FileInput
							upperFile={setFile}
							setYaml={setYaml}
							setJson={setJson}
							categorizeJSON={categorizeJSON}
						/>
					</div>
					<div
						onClick={downloadFile}
						className="w-fit cursor-pointer text-white bg-[#0F172A] bottom-[1rem] right-8 fixed rounded-md p-2  h-fit font-bold ">
						Download Yaml File
					</div>
				</div>
			</div>
		</div>
	)
}
	