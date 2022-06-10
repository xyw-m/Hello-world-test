<template>
    <div>
        <label for="question">Ask a yes/no question</label>
        <input 
            type="text" 
            id="question"
            v-model="question">
        <p>{{ answer }}</p>
        <h1> {{ title }}</h1>
        <!--title会作为第一个参数传入Test.vue中的alert方法-->
        <button @click="$emit('alert', title)">
            alert
        </button>
        <el-select
            v-model="value"
            placeholder = "请选择">
            <el-option
                v-for="option in options"
                :key = option.value
                :value = option.value
                :label = option.label
            ></el-option>
        </el-select>
        <slot></slot>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'child',
    props: ['title'],
    data(){
        return {
            options:[
                {
                    value: "Legends Never Die",
                    label: "SSW"
                },
                {
                    value: "Rise",
                    label: "IG"
                },
                {
                    value: "Phoenix",
                    label: "FPX"
                }
            ],
            value: '',
            question: '',
            answer: ''
        }
    },
    watch: {
        question(newQuestion, oldQuestion){
            if(newQuestion.indexOf('?', newQuestion.length - 1) > 0){
                this.answer = 'Thinking...'
                this.getAnswer()
            } else {
                this.answer = 'Question usually end with a question mask.'
            }
        }
    },
    methods: {
        getAnswer(){
            axios.get('https://yesno.wtf/api')
                    .then(response => {
                        console.log(response)
                        this.answer = response.data.answer
                    })
                    .catch(error => {
                        this.answer = 'Error! Could not reach the API' + error
                    })
        }
    }
}
</script>
