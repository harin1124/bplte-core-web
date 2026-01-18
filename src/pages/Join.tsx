import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import Logo from '@/pages/Logo.tsx';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { RESPONSE } from '@/constants/api.ts';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/hooks/useAlert';
import { ALERT } from '@/constants/message.ts';

type JoinFormValue = {
  userId: string;
  userName: string;
  email: string;
  password: string;
};

const initFormValue: JoinFormValue = {
  userId: '',
  userName: '',
  email: '',
  password: '',
};

const Join = () => {
  const method = useForm({
    defaultValues: initFormValue,
  });

  const navigate = useNavigate();
  const { register } = method;
  const { showAlert } = useAlert();

  const onSubmit = async () => {
    await axios
      .post('http://localhost:8080/bplte/core/auth/join', method.getValues())
      .then((res) => {
        const data = res.data;
        if (data.resultCode === RESPONSE.SUCCESS && data.data === 1) {
          showAlert({
            title: ALERT.TITLE.SUCCESS,
            description: '회원가입에 성공하였습니다.',
            onClose: () => navigate('/login'),
          });
        } else {
          showAlert({
            title: ALERT.TITLE.ERROR,
            description: '회원가입 중 오류가 발생하였습니다.\n' + data.resultMessage,
          });
        }
      })
      .catch((e) => {
        showAlert({
          title: ALERT.TITLE.ERROR,
          description: '회원가입 중 오류가 발생하였습니다.\n' + e.message,
        });
      });
  };

  return (
    <>
      <div className="flex w-full h-screen items-center justify-center">
        <div className="flex w-full flex-col" style={{ width: '500px' }}>
          <Logo />
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">회원가입</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="userId">사용자 아이디</FieldLabel>
                    <Input
                      id="userId"
                      type="text"
                      {...register('userId')}
                      placeholder="john.doe"
                      maxLength={30}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="userName">이름</FieldLabel>
                    <Input
                      id="userName"
                      type="text"
                      {...register('userName')}
                      placeholder="John Doe"
                      maxLength={30}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">이메일</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="john@example.com"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                    <Input id="password" type="password" {...register('password')} required />
                    <FieldDescription style={{ textAlign: 'left' }}>
                      비밀번호는 10자 이상입니다.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <Button type="button" onClick={onSubmit}>
                      회원가입
                    </Button>
                    <FieldDescription className="text-center">
                      이미 회원가입을 하셨나요? <a href="/login">로그인</a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Join;
