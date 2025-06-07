import { useState } from 'react'
import { Camera, Upload, AlertTriangle, Info } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import CameraCapture from './components/CameraCapture'
import AnalysisResult from './components/AnalysisResult'

// 대표적인 불가 품목 목록
const prohibitedItems = [
  {
    category: '액체류',
    items: ['100ml 초과 액체', '스프레이', '에어로졸'],
    reason: '보안상의 이유로 제한됩니다'
  },
  {
    category: '전자기기',
    items: ['100Wh 초과 배터리', '보조배터리(대용량)'],
    reason: '화재 위험이 있어 제한됩니다'
  },
  {
    category: '무기류',
    items: ['칼', '가위', '도구류'],
    reason: '보안상의 이유로 제한됩니다'
  },
  {
    category: '스포츠용품',
    items: ['골프채', '야구방망이', '스키장비'],
    reason: '크기와 위험성으로 인해 제한됩니다'
  }
]

function App() {
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">수하물 체크</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* 안내 정보 */}
        {showInfo && (
          <Card className="p-4 mb-6 bg-blue-50 border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2">수하물 규정 안내</h3>
            <div className="space-y-4">
              {prohibitedItems.map((category, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h4 className="font-semibold text-gray-800">{category.category}</h4>
                  </div>
                  <div className="ml-7">
                    <ul className="text-sm text-gray-600 space-y-1">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mt-2">{category.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 카메라/업로드 섹션 */}
        <div className="space-y-6">
          <CameraCapture onAnalysisComplete={setAnalysisResult} />
          {analysisResult && <AnalysisResult result={analysisResult} />}
        </div>
      </div>
    </div>
  )
}

export default App 