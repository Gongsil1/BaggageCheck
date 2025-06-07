import React, { useRef, useState } from 'react'
import { Camera, Upload, Loader2 } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Gemini AI 설정
const genAI = new GoogleGenerativeAI('AIzaSyD2NBMydOQw_GOepdRtksFaPdHSdg1dYok')

interface CameraCaptureProps {
  onAnalysisComplete: (result: any) => void
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // 카메라 시작
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('카메라 접근 실패:', err)
      alert('카메라 접근에 실패했습니다.')
    }
  }

  // 카메라 중지
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  // 사진 촬영
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const imageUrl = canvas.toDataURL('image/jpeg')
        setPreviewUrl(imageUrl)
        stopCamera()
        analyzeImage(imageUrl)
      }
    }
  }

  // 파일 선택
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setPreviewUrl(imageUrl)
        analyzeImage(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  // 이미지 분석
  const analyzeImage = async (imageUrl: string) => {
    setIsAnalyzing(true)
    try {
      // 이미지를 base64에서 blob으로 변환
      const imageResponse = await fetch(imageUrl)
      const blob = await imageResponse.blob()

      // Gemini AI 모델 초기화
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })

      // 이미지 분석 요청
      const result = await model.generateContent([
        "이 이미지의 물건이 항공기 기내 수하물로 반입 가능한지 분석해주세요. 다음 형식으로 답변해주세요: {allowed: boolean, reason: string, category: string}",
        {
          inlineData: {
            data: imageUrl.split(',')[1],
            mimeType: "image/jpeg"
          }
        }
      ])

      const response = await result.response
      const text = response.text()
      
      // 응답 파싱
      const analysis = JSON.parse(text)
      
      onAnalysisComplete({
        image: imageUrl,
        timestamp: new Date().toISOString(),
        ...analysis
      })

    } catch (error) {
      console.error('이미지 분석 실패:', error)
      alert('이미지 분석에 실패했습니다.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* 카메라 프리뷰 */}
        {stream ? (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <Button
              onClick={capturePhoto}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              size="lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              촬영
            </Button>
          </div>
        ) : previewUrl ? (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <Button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2"
              variant="destructive"
              size="sm"
            >
              다시 촬영
            </Button>
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">카메라를 시작하거나 이미지를 업로드하세요</p>
          </div>
        )}

        {/* 컨트롤 버튼 */}
        <div className="flex space-x-2">
          {!stream && !previewUrl && (
            <>
              <Button
                onClick={startCamera}
                className="flex-1"
                disabled={isAnalyzing}
              >
                <Camera className="w-5 h-5 mr-2" />
                카메라 시작
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1"
                disabled={isAnalyzing}
              >
                <Upload className="w-5 h-5 mr-2" />
                이미지 업로드
              </Button>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* 로딩 상태 */}
        {isAnalyzing && (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>이미지 분석 중...</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default CameraCapture 