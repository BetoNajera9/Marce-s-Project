<template>
	<div :class="{ content: 'content', active: isActive }">
		<h1>Cliente</h1>
		<FormKit
			type="form"
			id="customerForm"
			:config="{ validationVisibility: 'submit' }"
			submit-label="Crear"
			form-class="form"
			actions-class="submit"
			message-class="message"
			@submit="createCustome"
		>
			<FormKit
				id="name"
				type="text"
				label="Nombre"
				v-model="data.name"
				validation="required"
				:validation-messages="{
					required: 'El nombre es requerido.',
				}"
				input-class="$reset input"
				inner-class="$reset inner"
				outer-class="name"
			/>

			<FormKit
				id="phone"
				type="tel"
				label="Telefono"
				v-model="data.phone"
				validation="required|matches:/^[0-9]{10}$/"
				:validation-messages="{
					required: 'El telefono es requerido.',
					matches: 'El telfono debe de ser minimo 10 numeros.',
				}"
				input-class="$reset input"
				inner-class="$reset inner"
			/>

			<FormKit
				id="RFC"
				type="text"
				label="RFC"
				v-model="data.RFC"
				input-class="$reset input"
				inner-class="$reset inner"
			/>

			<FormKit
				id="wayToPay"
				type="select"
				label="Forma de pago"
				v-model="data.wayToPay"
				:options="['EFECTIVO', 'TARJETA DE CREDITO/DEBITO']"
				input-class="$reset input"
				inner-class="$reset inner"
			/>

			<FormKit
				id="CFDI"
				type="text"
				label="Uso de CFDI"
				v-model="data.CFDI"
				input-class="$reset input"
				inner-class="$reset inner"
				outer-class="name"
			/>
		</FormKit>
		<table-data :typeTable="'customer'" />
	</div>
</template>

<script>
import TableData from '../components/TableData.vue'
import { ipcRenderer } from 'electron'

export default {
	components: {
		TableData,
	},
	data: () => ({
		data: {
			name: '',
			phone: '',
			RFC: '',
			wayToPay: 'EFECTIVO',
			CFDI: '',
		},
	}),

	watch: {
		'data.name'(newName) {
			if (newName) this.data.name = newName.toUpperCase()
		},
		'data.RFC'(newRFC) {
			if (newRFC) this.data.RFC = newRFC.toUpperCase()
		},
		'data.CFDI'(newCFDI) {
			if (newCFDI) this.data.CFDI = newCFDI.toUpperCase()
		},
	},

	methods: {
		createCustome() {
			ipcRenderer.send('create-customer', JSON.parse(JSON.stringify(this.data)))

			this.$formkit.reset('customerForm')
		},
	},

	computed: {
		isActive() {
			return this.$store.getters.isActive
		},
	},
}
</script>

<style>
.content {
	position: absolute;
	padding: 10px;
	width: calc(100% - 100px);
	left: 78px;
	transition: all 0.5s ease;
}

.content .text {
	font-size: 25px;
	font-weight: 500;
	color: black;
	margin: 12px;
}

.content.active {
	width: calc(100% - 260px);
	left: 240px;
}

.form {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	column-gap: 20px;
}

.formkit-outer + .formkit-outer {
	height: 92px;
	width: 180px;
}

.input {
	border: 1px solid black;
	height: 30px;
	width: 100%;
	border-radius: 6px;
}

.formkit-message.message {
	display: none;
	position: relative;
}

.formkit-actions.submit {
	margin-top: 16px !important;
}

.formkit-outer.name {
	width: 250px;
	border: 0 !important;
}
#name {
	width: 100%;
}

.formkit-outer.CFDI {
	width: 250px;
	border: 0 !important;
}
#CFDI {
	width: 100%;
}
</style>
