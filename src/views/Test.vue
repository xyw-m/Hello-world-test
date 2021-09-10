<template>
    <div class="about">
        <h1>what happened?</h1>
        <child
            v-for="post in posts"
            :title = post.title
            :key = post.id
            @alert = "alert"
        >
        </child>
    </div>
</template>

<script lang="javaScript">
import child from '@/components/child.vue';

export default {
  components: {child},
  data(){
        return {
            fontsize: 1,
            posts: [
                { title: "So are you gonna die today", id: 1},
                { title: "Or make it out alive? ", id: 2},
                { title: "You gotta conquer the monster in your head ", id:3},
                { title: "and then you'll fly", id: 4}
            ]
        }
    },
    methods: {
        enlargeText: function(){
            return this.fontsize + 1
        },
        alert: function(title){
            alert(title)
        }
    }
}
</script>