import React from 'react'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Card } from './components/ui/card'
import { Badge } from './components/ui/badge'

interface AnalysisResult {
  image: string
  timestamp: string
  allowed: boolean
  reason: string
  category: string
}

interface AnalysisResultProps {
  result: AnalysisResult
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case '액체류':
        return 'bg-red-100 text-red-800'
      case '전자기기':
        return 'bg-blue-100 text-blue-800'
      case '무기류':
        return 'bg-red-100 text-red-800'
      case '스포츠용품':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* 결과 이미지 */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <img
            src={result.image}
            alt="Analyzed item"
            className="w-full h-full object-contain"
          />
        </div>

        {/* 분석 결과 */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 relative">
            {result.allowed ? (
              <CheckCircle className="w-16 h-16 text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>

          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            result.allowed 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {result.allowed ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                기내 수하물 탑승 가능
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                위탁 수하물로 분류 필요
              </>
            )}
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">분류</span>
            <Badge
              variant="outline"
              className={getCategoryColor(result.category)}
            >
              {result.category}
            </Badge>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
              <p className="text-sm text-gray-700">{result.reason}</p>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-right">
            분석 시간: {new Date(result.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default AnalysisResult 