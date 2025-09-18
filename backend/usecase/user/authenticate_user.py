from infrastructure.models.user_model import user_model, LoginRequest
from ....handler.main import verify_password, app
from sqlalchemy.orm import Session
from ....database import get_db
from fastapi import status, Depends, HTTPException
from ....auth import jwt

@app.post(path='/user/login', status_code=status.HTTP_200_OK)
def authenticate_user(body: LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(user_model.User).filter(user_model.User.email == body.email).first()

    if not db_user or not(verify_password(body.password, db_user.password)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
        detail={
            "error": {
              "code": "INVALID_CREDENTIALS",
              "message": "メールアドレスまたはパスワードが正しくありません"
            }
          }
        )
    else: 
      access_token = jwt.create_token({"sub": str(db_user.id)})
      return {
          "user": {
          "id": db_user.id,
          "username": db_user.name,
          "email": db_user.email,
          "birthDate": db_user.password,
          "createdAt": db_user.created_at
        },
          "token": access_token
        }