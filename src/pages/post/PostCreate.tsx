import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';
import { FieldTitle } from '@/pages/post/component/FieldTitle.tsx';
import { useAlert } from '@/hooks/useAlert.ts';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import coreApi from '@/lib/api.ts';
import { useEffect, useState } from 'react';

type PostCreateFormValue = {
  title: string;
  content: string;
  attachFileList: FileList | null;
};

const initFormValue: PostCreateFormValue = {
  title: '',
  content: '',
  attachFileList: null,
};

const PostCreate = () => {
  const navigator = useNavigate();
  const { showAlert } = useAlert();

  const method = useForm({
    defaultValues: initFormValue,
  });

  const { register } = method;
  const watchTitle = method.watch('title');
  const watchContent = method.watch('content');

  const [createValid, setCreateValid] = useState<boolean>(false);
  useEffect(() => {
    if (watchTitle && watchTitle.length > 0 && watchContent && watchContent.length > 0) {
      setCreateValid(true);
    } else {
      setCreateValid(false);
    }
  }, [watchTitle, watchContent]);

  const onSubmit = async () => {
    if (!createValid) {
      showAlert({
        type: 'alert',
        description: '필수 입력값이 누락되었습니다.',
      });
    }

    const formData = new FormData();
    formData.append('title', method.getValues().title);
    formData.append('content', method.getValues().content);

    const attachFileList = method.getValues().attachFileList;

    if (attachFileList instanceof FileList && attachFileList.length > 0) {
      Array.from(attachFileList).forEach((file) => {
        formData.append('attachFileList', file);
      });
    }

    await coreApi.post('/posts', formData).then((res) => {
      const data = res.data;
      if (data.data === 1) {
        toast.success('성공', {
          position: 'bottom-left',
          description: '게시글이 등록되었습니다.',
        });
        navigator('/post/list');
      } else {
        showAlert({
          type: 'alert',
          description: '게시글 등록 중 오류가 발생했습니다.',
        });
      }
    });
  };

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
              <FieldTitle
                id={'title'}
                title={'제목'}
                desc={'100자 이내로 입력해주세요.'}
                required={true}
              />
              <Input id="title" type="text" maxLength={100} {...register('title')} />
            </Field>
            <Field>
              <FieldTitle
                id={'content'}
                title={'내용'}
                desc={'내용을 입력해주세요.'}
                required={true}
              />
              <Textarea
                id="content"
                {...register('content')}
                style={{ minHeight: '200px', maxHeight: '500px' }}
              />
            </Field>
            <Field>
              <FieldTitle
                id={'attachFileList'}
                title={'첨부파일'}
                desc={'첨부파일을 선택해주세요.'}
                required={false}
              />
              <Input
                id="attachFileList"
                type="file"
                multiple={true}
                {...register('attachFileList')}
              />
            </Field>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="button" onClick={onSubmit} disabled={!createValid}>
              저장
            </Button>
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
