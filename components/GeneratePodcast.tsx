// import { GeneratePodcastProps } from '@/types'
// import React, { useState } from 'react'
// import { Label } from './ui/label'
// import { Textarea } from './ui/textarea'
// import { Button } from './ui/button'
// import { Loader } from 'lucide-react'
// import { useAction, useMutation } from 'convex/react'
// import { api } from '@/convex/_generated/api'
// import { v4 as uuidv4 } from 'uuid';
// import { useToast } from "@/components/ui/use-toast"

// import { useUploadFiles } from '@xixixao/uploadstuff/react';

// const useGeneratePodcast = ({
//   setAudio, voiceType, voicePrompt, setAudioStorageId
// }: GeneratePodcastProps) => {
//   const [isGenerating, setIsGenerating] = useState(false);
//   const { toast } = useToast()

//   const generateUploadUrl = useMutation(api.files.generateUploadUrl);
//   const { startUpload } = useUploadFiles(generateUploadUrl)

//   const getPodcastAudio = useAction(api.openai.generateAudioAction)

//   const getAudioUrl = useMutation(api.podcasts.getUrl);

//   const generatePodcast = async () => {
//     setIsGenerating(true);
//     setAudio('');

//     if(!voicePrompt) {
//       toast({
//         title: "Please provide a voiceType to generate a podcast",
//       })
//       return setIsGenerating(false);
//     }

//     try {
//       const response = await getPodcastAudio({
//         voice: voiceType,
//         input: voicePrompt
//       })

//       const blob = new Blob([response], { type: 'audio/mpeg' });
//       const fileName = `podcast-${uuidv4()}.mp3`;
//       const file = new File([blob], fileName, { type: 'audio/mpeg' });

//       const uploaded = await startUpload([file]);
//       const storageId = (uploaded[0].response as any).storageId;

//       setAudioStorageId(storageId);

//       const audioUrl = await getAudioUrl({ storageId });
//       setAudio(audioUrl!);
//       setIsGenerating(false);
//       toast({
//         title: "Podcast generated successfully",
//       })
//     } catch (error) {
//       console.log('Error generating podcast', error)
//       toast({
//         title: "Error creating a podcast",
//         variant: 'destructive',
//       })
//       setIsGenerating(false);
//     }
    
//   }

//   return { isGenerating, generatePodcast }
// }

// const GeneratePodcast = (props: GeneratePodcastProps) => {
//   const { isGenerating, generatePodcast } = useGeneratePodcast(props);

//   return (
//     <div>
//       <div className="flex flex-col gap-2.5">
//         <Label className="text-16 font-bold text-white-1">
//           AI Prompt to generate Podcast
//         </Label>
//         <Textarea 
//           className="input-class font-light focus-visible:ring-offset-orange-1"
//           placeholder='Provide text to generate audio'
//           rows={5}
//           value={props.voicePrompt}
//           onChange={(e) => props.setVoicePrompt(e.target.value)}
//         />
//       </div>
//       <div className="mt-5 w-full max-w-[200px]">
//       <Button type="submit" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodcast}>
//         {isGenerating ? (
//           <>
//             Generating
//             <Loader size={20} className="animate-spin ml-2" />
//           </>
//         ) : (
//           'Generate'
//         )}
//       </Button>
//       </div>
//       {props.audio && (
//         <audio 
//           controls
//           src={props.audio}
//           autoPlay
//           className="mt-5"
//           onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
//         />
//       )}
//     </div>
//   )
// }

// export default GeneratePodcast

// import { GeneratePodcastProps } from '@/types'
// import React, { useState } from 'react'
// import { Label } from './ui/label'
// import { Textarea } from './ui/textarea'
// import { Button } from './ui/button'
// import { Loader } from 'lucide-react'
// import { useAction, useMutation } from 'convex/react'
// import { api } from '@/convex/_generated/api'
// import { v4 as uuidv4 } from 'uuid';
// import { useToast } from "@/components/ui/use-toast"
// import { useUploadFiles } from '@xixixao/uploadstuff/react';

// //*/ Custom hook to manage podcast generation
// const useGeneratePodcast = ({
//   setAudio, voiceType, voicePrompt, setAudioStorageId
// }: GeneratePodcastProps) => {
//   const [isGenerating, setIsGenerating] = useState(false);
//   const { toast } = useToast();

//   const generateUploadUrl = useMutation(api.files.generateUploadUrl);
//   const { startUpload } = useUploadFiles(generateUploadUrl);

//   //*/ Updated to ElevenLabs (same Convex action name, but now it calls ElevenLabs under the hood)
//   const getPodcastAudio = useAction(api.openai.generateAudioAction);

//   const getAudioUrl = useMutation(api.podcasts.getUrl);

//   const generatePodcast = async () => {
//     setIsGenerating(true);
//     setAudio('');

//     if (!voicePrompt) {
//       toast({
//         title: "Please provide a prompt to generate the podcast",
//       });
//       return setIsGenerating(false);
//     }

//     try {
//       //*/ Step 1: Generate audio using ElevenLabs
//       const response = await getPodcastAudio({
//         voice: voiceType,   // e.g., 'Alice', 'Bill', etc.
//         input: voicePrompt, // text entered by user
//       });

//       //*/ Step 2: Convert response (ArrayBuffer) → Blob → File
//       const blob = new Blob([response], { type: 'audio/mpeg' });
//       const fileName = `podcast-${uuidv4()}.mp3`;
//       const file = new File([blob], fileName, { type: 'audio/mpeg' });

//       //*/ Step 3: Upload file to Convex storage
//       const uploaded = await startUpload([file]);
//       const storageId = (uploaded[0].response as any).storageId;
//       setAudioStorageId(storageId);

//       //*/ Step 4: Get public audio URL
//       const audioUrl = await getAudioUrl({ storageId });
//       setAudio(audioUrl!);

//       setIsGenerating(false);
//       toast({
//         title: "✅ Podcast generated successfully",
//       });
//     } catch (error) {
//       console.error('Error generating podcast:', error);
//       toast({
//         title: "❌ Error creating podcast",
//         variant: 'destructive',
//       });
//       setIsGenerating(false);
//     }
//   };

//   return { isGenerating, generatePodcast };
// };

// const GeneratePodcast = (props: GeneratePodcastProps) => {
//   const { isGenerating, generatePodcast } = useGeneratePodcast(props);

//   return (
//     <div>
//       {/* Prompt input */}
//       <div className="flex flex-col gap-2.5">
//         <Label className="text-16 font-bold text-white-1">
//           AI Prompt to Generate Podcast
//         </Label>
//         <Textarea
//           className="input-class font-light focus-visible:ring-offset-orange-1"
//           placeholder="Enter text to convert into audio"
//           rows={5}
//           value={props.voicePrompt}
//           onChange={(e) => props.setVoicePrompt(e.target.value)}
//         />
//       </div>

//       {/* Generate button */}
//       <div className="mt-5 w-full max-w-[200px]">
//         <Button
//           type="submit"
//           className="text-16 bg-orange-1 py-4 font-bold text-white-1"
//           onClick={generatePodcast}
//           disabled={isGenerating}
//         >
//           {isGenerating ? (
//             <>
//               Generating
//               <Loader size={20} className="animate-spin ml-2" />
//             </>
//           ) : (
//             'Generate'
//           )}
//         </Button>
//       </div>

//       {/* Audio player */}
//       {props.audio && (
//         <audio
//           controls
//           src={props.audio}
//           autoPlay
//           className="mt-5 w-full"
//           onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
//         />
//       )}
//     </div>
//   );
// };

// export default GeneratePodcast;


"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { GeneratePodcastProps } from "@/types";

const useGeneratePodcast = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageId,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const generateAudio = useAction(api.openai.generateAudioAction);
  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const generatePodcast = async () => {
    if (!voicePrompt) {
      toast({ title: "Please enter text for the podcast" });
      return;
    }

    try {
      setIsGenerating(true);
      setAudio("");

      // Step 1: Generate audio from ElevenLabs
      const response = await generateAudio({
        input: voicePrompt,
        voice: voiceType, // e.g., "Rachel"
      });

      if (!response?.audioBase64) {
        throw new Error("No audio data returned from ElevenLabs");
      }

      // Step 2: Convert base64 → Blob → File
      const audioBytes = Uint8Array.from(
        atob(response.audioBase64),
        (c) => c.charCodeAt(0)
      );
      const blob = new Blob([audioBytes], { type: "audio/mpeg" });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });

      // Step 3: Upload to Convex Storage
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);

      // Step 4: Get public URL
      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);

      toast({ title: "✅ Podcast audio generated successfully" });
    } catch (error) {
      console.error("❌ Error generating podcast:", error);
      toast({ title: "Error creating podcast", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, generatePodcast };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to Generate Podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Enter your podcast narration text..."
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>

      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="button"
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={generatePodcast}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              Generating <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5 w-full"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
