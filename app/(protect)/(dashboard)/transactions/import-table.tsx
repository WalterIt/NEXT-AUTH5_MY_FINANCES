import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
//   import TableHeadSelect from "./table-head-select";
  
  type Props = {
    headers: string[];
    body: string[][];
    selectedColumns: Record<string, string | null>;
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
  };

  const ImportTable = ({
    headers,
    body,
    selectedColumns,
    onTableHeadSelectChange,
  }: Props) => {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index}>
                    <p>Table Head</p>
                  {index}
                  {/* <TableHeadSelect
                    columnIndex={index}
                    selectedColumns={selectedColumns}
                    onChange={onTableHeadSelectChange}
                  /> */}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {body.map((row: string[], index) => (
              <TableRow key={index}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  export default ImportTable;