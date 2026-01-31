import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field.tsx';
import { RequiredDot } from '@/components/custom/RequiredDot.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useAlert } from '@/hooks/useAlert.ts';
import { useNavigate } from 'react-router-dom';

const PostCreate = () => {
  const navigator = useNavigate();
  const { showAlert } = useAlert();

  return (
    <div style={{ width: '100%' }}>
      <form>
        <FieldGroup>
          <FieldSet style={{ alignItems: 'baseline' }}>
            <FieldLegend style={{ width: '100%', textAlign: 'left' }}>게시글 등록</FieldLegend>
            <FieldDescription style={{ alignItems: 'baseline' }}>
              게시물을 등록합니다.
            </FieldDescription>
            <Field>
              <FieldLabel htmlFor="title">
                제목
                <RequiredDot />
              </FieldLabel>
              <FieldDescription style={{ textAlign: 'left' }}>
                100자 이내로 입력해주세요.
              </FieldDescription>
              <Input id="title" type="text" maxLength={100} />
            </Field>
            <Field>
              <FieldLabel htmlFor="content">내용</FieldLabel>
              <FieldDescription style={{ textAlign: 'left' }}>
                내용을 입력해주세요.
              </FieldDescription>
              <Textarea id="content" style={{ minHeight: '200px', maxHeight: '500px' }} />
            </Field>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="button">저장</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                showAlert({
                  type: 'confirm',
                  description: '게시글 등록을 취소하시겠습니까?',
                  onConfirm: () => navigator('/post/list'),
                })
              }
            >
              취소
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default PostCreate;
