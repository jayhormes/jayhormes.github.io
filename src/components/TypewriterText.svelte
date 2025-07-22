<script lang="ts">
import { onMount } from "svelte";

export let texts: string[] = [];
export let speed = 100;
export let delay = 2000;
export let fontSize = "2.5rem";
export let fontFamily = "inherit";
export let fontWeight = "600";
export let color = "inherit";
export let cursorColor = "currentColor";
export let textAlign = "center";

let currentText = "";
let currentIndex = 0;
let isTyping = true;
let charIndex = 0;

onMount(() => {
	if (texts.length === 0) return;

	const typeWriter = () => {
		const fullText = texts[currentIndex];

		if (isTyping) {
			if (charIndex < fullText.length) {
				currentText = fullText.substring(0, charIndex + 1);
				charIndex++;
				setTimeout(typeWriter, speed);
			} else {
				isTyping = false;
				setTimeout(typeWriter, delay);
			}
		} else {
			if (charIndex > 0) {
				currentText = fullText.substring(0, charIndex - 1);
				charIndex--;
				setTimeout(typeWriter, speed / 2);
			} else {
				isTyping = true;
				currentIndex = (currentIndex + 1) % texts.length;
				setTimeout(typeWriter, speed);
			}
		}
	};

	typeWriter();
});
</script>

<div class="typewriter-container" style="font-size: {fontSize}; font-family: {fontFamily}; font-weight: {fontWeight}; color: {color}; text-align: {textAlign};">
	<span class="typewriter-text">{currentText}</span>
	<span class="cursor" style="color: {cursorColor};">|</span>
</div>

<style>
	.typewriter-container {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 3rem;
		padding: 1rem;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.typewriter-text {
		white-space: nowrap;
		letter-spacing: 0.02em;
	}

	.cursor {
		animation: blink 1s infinite;
		margin-left: 2px;
		font-weight: lighter;
		opacity: 0.8;
	}

	@keyframes blink {
		0%, 50% {
			opacity: 1;
		}
		51%, 100% {
			opacity: 0;
		}
	}

	@media (max-width: 768px) {
		.typewriter-container {
			min-height: 2rem;
			padding: 0.5rem;
		}
		
		.typewriter-text {
			font-size: 0.9em;
		}
	}
</style>