from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .services import get_answer

@api_view(["POST"])
def ask_assistant(request):
    question = request.data.get("question", "").strip()
    if not question:
        return Response(
            {"error": "Question is required."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    answer = get_answer(question)
    return Response({
        "question": question,
        "answer": answer
    })