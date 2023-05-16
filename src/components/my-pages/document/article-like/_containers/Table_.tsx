import { useTable } from "react-table"
import tw from "twin.macro"

import { TableSection } from "^types/entities"

const Table_ = ({
  table: { columns, rows: data, col1IsTitular, notes, title },
  tableNum,
}: {
  table: TableSection
  tableNum: number
}) => {
  const tableInstance = useTable({ columns, data })

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  return (
    <div css={[tw`w-full inline-block overflow-x-auto`]}>
      <div css={[tw`mx-xs border-t border-b border-gray-400 pt-xs pb-sm`]}>
        <h4 css={[tw`border-b border-gray-400 pb-xs tracking-wide`]}>
          <span css={[tw`font-bold `]}>
            T<span css={[tw`uppercase text-xs`]}>able</span>{" "}
            <span css={[tw`inline-block translate-y-[2px]`]}>{tableNum}</span>
          </span>
          {title ? (
            <span>
              :{" "}
              <span css={[tw`text-lg text-gray-800 capitalize`]}>{title}</span>
            </span>
          ) : null}
        </h4>
        <div css={[tw`grid place-items-center`]}>
          <table {...getTableProps()} css={[tw`relative mt-sm`]}>
            <thead
              css={[tw`border-b border-gray-400 italic whitespace-nowrap`]}
            >
              {headerGroups.map((headerGroup, i) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                  {headerGroup.headers.map((column, colIndex) => {
                    return (
                      <th
                        {...column.getHeaderProps()}
                        css={[
                          tw`relative py-xs px-sm`,
                          col1IsTitular && colIndex === 0
                            ? tw`text-right`
                            : tw`text-center`,
                        ]}
                        key={colIndex}
                      >
                        {column.render("Header")?.toString()}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, rowIndex) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()} key={rowIndex}>
                    {row.cells.map((cell, rowCellIndex) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          css={[
                            tw`relative py-xs px-sm `,
                            cell.column.id === "col1" && col1IsTitular
                              ? tw`text-right font-semibold italic whitespace-nowrap`
                              : tw`text-center`,
                            rowIndex === 0 && tw`pt-sm`,
                          ]}
                          key={rowCellIndex}
                        >
                          {cell.value}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {notes ? (
        <div
          css={[
            tw`mt-sm pl-sm text-gray-700 text-sm whitespace-pre-wrap leading-6`,
          ]}
        >
          {notes}
        </div>
      ) : null}
    </div>
  )
}

export default Table_
