# 기내 수화물 불가 항목 리스트
forbidden_items = [
    "골프채", "야구방망이", "스키장비", "스노보드", "하키스틱",
    "액체류 100ml 초과", "가스통", "전지", "화장품 100ml 초과",
    "칼", "가위", "드라이버", "해머", "스패너",
    "스프레이", "압축가스", "인화성물질", "폭발물",
    "전자담요", "전기장판", "전기히터", "전기밥솥",
    "생선", "고기", "과일", "채소", "유제품",
    "알코올 70% 이상", "의약품 100ml 초과"
]

def check_baggage(item):
    """
    입력받은 물품이 기내 수화물로 가능한지 확인하는 함수
    
    Args:
        item (str): 확인할 물품 이름
        
    Returns:
        str: 확인 결과 메시지
    """
    if item in forbidden_items:
        return f"'{item}'은(는) 기내 수화물로 반입이 불가능합니다. 위탁수화물로 포함하세요."
    else:
        return f"'{item}'은(는) 기내 수화물로 반입이 가능합니다."

def print_forbidden_list():
    """기내 수화물 불가 항목 리스트를 출력하는 함수"""
    print("\n=== 기내 수화물 반입 불가 항목 리스트 ===")
    for i, item in enumerate(forbidden_items, 1):
        print(f"{i}. {item}")
    print("======================================\n")

def main():
    print("기내 수화물 체크 프로그램입니다.")
    print("물품을 입력하면 기내 수화물 반입 가능 여부를 알려드립니다.")
    print("종료하려면 'q' 또는 'quit'를 입력하세요.")
    
    print_forbidden_list()
    
    while True:
        user_input = input("\n확인할 물품을 입력하세요: ").strip()
        
        if user_input.lower() in ['q', 'quit']:
            print("프로그램을 종료합니다.")
            break
            
        if not user_input:
            print("물품을 입력해주세요.")
            continue
            
        result = check_baggage(user_input)
        print(result)

if __name__ == "__main__":
    main() 