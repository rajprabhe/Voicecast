// import { action } from "./_generated/server";
// import { v } from "convex/values";

// import OpenAI from "openai";
// import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// export const generateAudioAction = action({
//   args: { input: v.string(), voice: v.string() },
//   handler: async (_, { voice, input }) => {
//     const mp3 = await openai.audio.speech.create({
//       model: "tts-1",
//       voice: voice as SpeechCreateParams['voice'],
//       input,
//     });

//     const buffer = await mp3.arrayBuffer();
    
//     return buffer;
//   },
// });

// export const generateThumbnailAction = action({
//   args: { prompt: v.string() },
//   handler: async (_, { prompt }) => {
//     const response = await openai.images.generate({
//       model: 'dall-e-3',
//       prompt,
//       size: '1024x1024',
//       quality: 'standard',
//       n: 1,
//     })

//     const url = response.data[0].url;

//     if(!url) {
//       throw new Error('Error generating thumbnail');
//     }

//     const imageResponse = await fetch(url);
//     const buffer = await imageResponse.arrayBuffer();
//     return buffer;
//   }
// })

import { action } from "./_generated/server";
import { v } from "convex/values";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});

// Replace with your preferred default voice ID
const defaultVoiceId = "NDTYOmYEjbDIVCKB35i3";

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.optional(v.string()) },
  handler: async (_, { input, voice }) => {
    try {
      const voiceId = voice || defaultVoiceId;

      // Generate audio (returns ReadableStream<Uint8Array>)
      const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
        text: input,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128",
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.8,
        },
      });

      // Convert ReadableStream → single Uint8Array
      const reader = audioStream.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }

      // Merge all chunks into one Uint8Array
      const totalLength = chunks.reduce((acc, curr) => acc + curr.length, 0);
      const merged = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        merged.set(chunk, offset);
        offset += chunk.length;
      }

      // Convert Uint8Array → base64 for Convex-safe return
      const base64Audio = Buffer.from(merged.buffer).toString("base64");

      return { success: true, audioBase64: base64Audio };
    } catch (error) {
      console.error("❌ ElevenLabs TTS error:", error);
      throw new Error("Text-to-speech generation failed");
    }
  },
});
