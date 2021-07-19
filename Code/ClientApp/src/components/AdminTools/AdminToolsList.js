import React from 'react';
import { getCountryIcon, getValidFormat } from './utils';
import { AdminToolsViewMobile } from './AdminToolsViewMobile';
import { Table } from 'antd';

const AdminToolsList = ({filteredData, isMobile, columns, getTrimText, MenuItems, visible, onVisibleChange}) => {
  return (
    !isMobile
    ? (
        <div>
          <div className="userDetailsTable">
            {
              <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={filteredData}
                pagination={false}
              />
            }
          </div>
        </div>
      ) : (
      <div>
      {
        <div className="adminToolsdocumentTabs">
          {
            filteredData.map((data, index) => {
              data = getValidFormat(data);
              return (
                <AdminToolsViewMobile
                    data={data}
                    visible={visible}
                    onVisibleChange={onVisibleChange}
                    title={data.title}
                    description={getTrimText(data.description, true)}
                    date={data.date}
                    language={getCountryIcon(data.language)}
                    id={data.id}
                    key={index}
                    menu={<MenuItems data={data} />}
                />
              );
            })
          }
        </div>
      }
      </div>
    )
  );
};

export default AdminToolsList;
