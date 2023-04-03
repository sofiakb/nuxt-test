<template>
    <div>
        <h1>Welcome to the homepage</h1>
        <AppAlert>
            This is an auto-imported component.
        </AppAlert>

        {{ data }}

        <ssf-title>test</ssf-title>

        <nuxt-link to="/about">About</nuxt-link>

        <div>
            Counter: {{ counter }}
            <button @click="counter++">
                +
            </button>
            <button @click="counter--">
                -
            </button>
        </div>
    </div>
</template>

<script setup>

    const counter = useState('counter', () => Math.round(Math.random() * 1000))
    const { data } = await useFetch('/api/test')



</script>
