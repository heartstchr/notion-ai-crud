<template>
    <div class="absolute inset-0 z-0 pointer-events-none">
        <!-- Large floating circles -->
        <div
            class="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/25 to-purple-500/25 rounded-full animate-float-slow">
        </div>
        <div
            class="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/25 to-pink-500/25 rounded-full animate-float-medium">
        </div>
        <div
            class="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-indigo-400/25 to-blue-500/25 rounded-full animate-float-slow">
        </div>
        <div
            class="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-pink-400/25 to-purple-500/25 rounded-full animate-float-medium">
        </div>

        <!-- Medium geometric shapes -->
        <div
            class="absolute top-1/3 left-1/2 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rotate-45 animate-spin-slow">
        </div>
        <div
            class="absolute top-2/3 right-1/4 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-lg animate-bounce-gentle">
        </div>
        <div
            class="absolute top-1/4 right-1/2 w-12 h-12 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full animate-pulse-slow">
        </div>

        <!-- Small accent shapes -->
        <div
            class="absolute top-16 right-1/3 w-8 h-8 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full animate-bounce-slow">
        </div>
        <div
            class="absolute bottom-1/3 left-16 w-6 h-6 bg-gradient-to-br from-rose-400/30 to-pink-500/30 rounded-full animate-ping-slow">
        </div>
        <div
            class="absolute top-1/2 left-8 w-10 h-10 bg-gradient-to-br from-sky-400/30 to-cyan-500/30 rounded-full animate-pulse-medium">
        </div>
    </div>
</template>

<script setup>
// No props needed for this component
</script>

<style scoped>
/* Custom animations for background shapes */
@keyframes float-slow {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    25% {
        transform: translateY(-20px) rotate(1deg);
    }

    50% {
        transform: translateY(-10px) rotate(0deg);
    }

    75% {
        transform: translateY(-30px) rotate(-1deg);
    }
}

@keyframes float-medium {

    0%,
    100% {
        transform: translateY(0px) translateX(0px) rotate(0deg);
    }

    25% {
        transform: translateY(-15px) translateX(10px) rotate(2deg);
    }

    50% {
        transform: translateY(-25px) translateX(-5px) rotate(0deg);
    }

    75% {
        transform: translateY(-10px) translateX(15px) rotate(-2deg);
    }
}

@keyframes spin-slow {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes bounce-gentle {

    0%,
    100% {
        transform: translateY(0px) scale(1);
    }

    50% {
        transform: translateY(-15px) scale(1.05);
    }
}

@keyframes pulse-slow {

    0%,
    100% {
        opacity: 0.8;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.1);
    }
}

@keyframes pulse-medium {

    0%,
    100% {
        opacity: 0.7;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.15);
    }
}

@keyframes bounce-slow {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-20px);
    }
}

@keyframes ping-slow {
    0% {
        transform: scale(1);
        opacity: 0.8;
    }

    75%,
    100% {
        transform: scale(1.5);
        opacity: 0;
    }
}

/* Animation classes */
.animate-float-slow {
    animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
    animation: float-medium 6s ease-in-out infinite;
}

.animate-spin-slow {
    animation: spin-slow 20s linear infinite;
}

.animate-bounce-gentle {
    animation: bounce-gentle 4s ease-in-out infinite;
}

.animate-pulse-slow {
    animation: pulse-slow 6s ease-in-out infinite;
}

.animate-pulse-medium {
    animation: pulse-medium 4s ease-in-out infinite;
}

.animate-bounce-slow {
    animation: bounce-slow 5s ease-in-out infinite;
}

.animate-ping-slow {
    animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Responsive design */
@media (max-width: 768px) {

    /* Reduce animation intensity on mobile */
    .animate-float-slow,
    .animate-float-medium {
        animation-duration: 12s;
    }

    .animate-spin-slow {
        animation-duration: 30s;
    }
}
</style>
