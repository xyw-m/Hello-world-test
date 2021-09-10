<template>
    <div>
        <h1> {{ title }}</h1>
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
        <h2>what are you willing to lose?</h2>
    </div>
</template>

<script>
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
                value: ''
            }
        }
    }
</script>
