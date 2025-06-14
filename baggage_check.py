import requests

API_KEY = "사용자의 API키를 입력하세요"

# 금지물품 리스트 (전체 목록 반영)
PROHIBITED_ITEMS = list(set([
    "물총", "가위", "칼", "스위스 군용칼", "총", "화약", "폭발물",
    "화학약품", "염산", "과산화수소", "아세톤", "벤젠",
    "가스레인지", "스프레이", "압축가스",
    "위조화폐", "위조채권", "위조은행권", "원화표시여행자수표",
    "여행자수표", "실물증권", "자기앞수표", "당좌수표", "우편환",
    "귀금속", "골드바", "총기", "도검", "화약", "무기",
    "폭발물", "유독성물질", "폭죽", "식칼", "식도", "과도", "나이프",
    "칼", "커터칼", "눈썹칼", "맥가이버칼", "스위스칼",
    "공구", "망치", "렌치", "가위", "면도기", "마약", "멸종위기종",
    "야생동물", "호랑이", "표범", "코끼리", "타조", "매",
    "올빼미", "코브라", "거북", "악어", "철갑상어", "산호", "난",
    "선인장", "알로에", "박제", "모피", "모피핸드백", "모피가방",
    "모피지갑", "상아", "상아팔찌", "상아목걸이", "동물한약", "웅담",
    "사향", "식물한약", "목향", "구척", "천마", "식물", "과일",
    "채소", "야채", "농림산물류", "문화재", "문화유산", "유형문화유산",
    "물", "액체", "세면용품", "치약", "샴푸", "물약", "약", "술",
    "약주", "음료수", "로션", "핸드크림", "토너", "파운데이션", "스킨",
    "에센스", "세럼", "수분크림", "선크림", "메이크업베이스", "립글로스",
    "립오일", "컨실러", "BB크림", "CC크림", "미스트", "메이크업픽서",
    "클렌징오일", "클렌징밤", "클렌징폼", "세안제", "클렌징워터", "리무버",
    "네일리무버", "매니큐어", "퍼퓸", "향수", "헤어에센스", 
    "헤어스프레이", "산소스프레이", "해충기피제", "호신용스프레이", "에프킬라",
    "살충제", "고추장", "김치", "음식물", "아이스팩", "대형라이터", "전기라이터", "토치"
]))

# 허용물품 리스트
ALLOWED_ITEMS = list(set([
    "리튬이온배터리", "보조배터리", "배터리", "밧데리", "라이터", "성냥", "컴퓨터", "데스크탑", "노트북", "랩탑", "태블릿", 
    "폰", "스마트폰", "핸드폰", "스마트워치", "애플워치", "아이패드", "카메라", "캠코더", "웨어러블", "고데기", "매직기", 
    "전자담배", "등산용스틱", "등산스틱", "삼각대", "셀카봉", "트라이포드", "옷", "종이", "케이블", "책", "휴대폰", 
    "충전기", "이어폰", "손목시계", "안경", "선글라스", "물티슈", "휴지", "칫솔", "볼펜", "연필", "노트", "공책", 
    "파우치", "마스크", "비누", "수건", "물병", "우산", "샌들", "운동화", "슬리퍼", "모자", "지갑", "카드지갑", 
    "열쇠", "베개", "담요", "목베개", "에코백", "종이봉투", "비닐봉지", "과자", "사탕", "초콜릿", "비타민", "약통", 
    "쿠션", "손거울", "빗", "헤어밴드", "헤어핀", "안대", "베개", "목베개", "귀마개", "파우더", "아이섀도우", "블러셔", 
    "립스틱", "립밤", "고체향수", "고체비누", "쿠션", "고체파운데이션", "브로우펜슬", "아이라이너펜슬", "마스카라", 
    "메이크업스펀지", "거울", "뷰러", "햇반", "즉석밥", "라면", "삶은달걀", "소금", "프라이팬", "냄비", "전기밥솥", 
    "레고", "블록", "양말", "브라우니", "캔디", "아이폰"
]))

# 금지/허용 물품 확인 함수
def check_item_list(item: str):
    if item in PROHIBITED_ITEMS:
        return True, f"⛔️ 경고: '{item}'은(는) 기내 수하물로 반입이 불가능합니다.", "[판단 근거] 금지물품 목록에 등록된 물품입니다."
    elif item in ALLOWED_ITEMS:
        return False, f"✅ 안내: '{item}'은(는) 기내 수하물로 반입이 가능합니다.", "[판단 근거] 허용물품 목록에 등록된 물품입니다."
    return None, None, None  # 리스트에 없음

def main():
    print("수하물 검사 프로그램에 오신 것을 환영합니다!\n")
    print("물품 검사를 시작합니다. (종료하려면 '종료' 입력)")
    while True:
        try:
            item = input("\n검사할 물품 이름을 입력하세요: ").strip()
            if item == "종료":
                print("\n프로그램을 종료합니다.")
                break
            if not item:  # 빈 입력 처리
                print("물품 이름을 입력해주세요.")
                continue

            is_prohibited, message, reason = check_item_list(item)
            if is_prohibited is not None:
                print(f"\n{message}")
                print(reason)
            else:
                print("AI 분석 중... 잠시만 기다려주세요.")
                is_prohibited, ai_result = analyze_text_with_ai(item)

                # if is_prohibited:
                #     print(f"\n⛔️ 경고: '{item}'은(는) 기내 수하물로 반입이 불가능합니다.")
                # else:
                #     print(f"\n✅ 안내: '{item}'은(는) 기내 수하물로 반입이 가능합니다.")
                
                print(f"{ai_result}")

        except Exception as e:
            print(f"오류가 발생했습니다: {e}\n")
            continue

def analyze_text_with_ai(text: str):
    # 리스트에서 먼저 검사
    is_prohibited, message, reason = check_item_list(text)
    if is_prohibited is not None:
        return is_prohibited, f"{message}\n{reason}"
    
    prompt = f"""
You are a professional airline baggage inspector and aviation safety expert.

Evaluate whether the following item can be brought in carry-on baggage on an international flight, based strictly on IATA rules and aviation safety principles.

⚠️ VERY IMPORTANT INSTRUCTIONS:

1. Be **strict and conservative**. If there is **any possibility** that the item might be prohibited, you must consider it **prohibited**.
2. In that case, start your Korean response with: ⛔️ 경고:
3. Only if you are **completely certain** that the item is allowed on all international flights as carry-on baggage, you may use: ✅ 안내:
4. You must output the final answer in **Korean only**, including the warning/guidance icon.
5. Your answer should be clear, natural Korean for a typical airline passenger.

Item to evaluate: "{text}"
    """

    try:
        ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        params = {"key": API_KEY}
    
        data = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}]
                }
            ]
        }

        response = requests.post(ENDPOINT, json=data, params=params)
        response.raise_for_status()
        result = response.json()

        try:
            ai_response = result['candidates'][0]['content']['parts'][0]['text']
        except (KeyError, IndexError):
            return False, "AI 응답을 파싱하는 데 실패했습니다."

        is_prohibited = ai_response.startswith('[금지]')
        return is_prohibited, ai_response

    except Exception as e:
        return False, f"AI 분석 중 오류 발생: {e}"

if __name__ == "__main__":
    main() 