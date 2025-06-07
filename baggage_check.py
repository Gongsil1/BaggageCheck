import requests

# OpenRouter API 정보
URL = "https://openrouter.ai/api/v1/chat/completions"
HEADERS = {
    "Authorization": "Bearer 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",  # 새 API 키 적용
    "Content-Type": "application/json"
}

# 금지물품 리스트
PROHIBITED_ITEMS = [
    "물총", "가위", "칼", "스위스 군용칼", "총", "화약", "폭발물",
    "화학약품", "염산", "과산화수소", "아세톤", "벤젠",
    "가스레인지", "라이터", "성냥", "스프레이", "압축가스"
]

# OpenRouter API로 텍스트 분석
def analyze_text_with_ai(text: str):
    prompt = f"""
    당신은 항공서비스 분야의 전문가이자 수하물 검사관입니다.\n아래는 항공기 기내 반입 금지 물품 목록입니다:\n{', '.join(PROHIBITED_ITEMS)}\n\n아래의 물품이 금지물품에 해당하는지, 그리고 그 이유와 관련 규정(국제항공운송협회, IATA 기준 등)을 한국어로 공식적이고 친절하게 설명해 주세요.\n물품: {text}
    """
    data = {
        "model": "meta-llama/llama-3.3-8b-instruct:free",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    try:
        response = requests.post(URL, headers=HEADERS, json=data)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"]
    except Exception as e:
        return f"AI 분석 중 오류 발생: {e}"

def main():
    print("수하물 검사 프로그램에 오신 것을 환영합니다!\n")
    while True:
        print("1. 텍스트로 물품 검사")
        print("2. 금지물품 목록 보기")
        print("3. 종료")
        choice = input("\n원하는 기능을 선택하세요 (1-3): ")
        if choice == "1":
            item = input("검사할 물품 이름을 입력하세요: ")
            print("AI 분석 중... 잠시만 기다려주세요.")
            result = analyze_text_with_ai(item)
            print(f"\n분석 결과: {result}\n")
        elif choice == "2":
            print("\n[금지물품 목록]")
            for item in PROHIBITED_ITEMS:
                print(f"- {item}")
            print()
        elif choice == "3":
            print("프로그램을 종료합니다.")
            break
        else:
            print("잘못된 입력입니다. 다시 선택해주세요.\n")

if __name__ == "__main__":
    main() 