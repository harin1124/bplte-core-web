import { useEffect, useState } from 'react';
import coreApi from '@/lib/api';
import { flexRender, useReactTable, type ColumnDef, getCoreRowModel } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
type Post = {
  postNumber: number;
  ownerUserId: string;
  title: string;
  regDt: string;
  rgtrId: string;
  mdfcnDt: string;
  mdfrId: string;
};

const columns: ColumnDef<Post>[] = [
  {
    accessorKey: 'postNumber',
    header: '번호',
  },
  {
    accessorKey: 'title',
    header: '제목',
  },
  {
    accessorKey: 'ownerUserId',
    header: '등록자',
  },
];

const Home = () => {
  const [postList, setPostList] = useState<Post[]>([]);

  const table = useReactTable({
    data: postList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => void getPostList(), []);

  const getPostList = async () => {
    const response = await coreApi.get('/posts');
    const data = response.data.data;
    setPostList(data);
  };

  return (
    <>
      <div style={{ width: '100%' }}>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} align={'left'}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Home;
