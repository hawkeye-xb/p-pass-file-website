import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const ListContainer = styled.div`
  padding: 40px 0;
  background: #fff;
`;

const ListItem = styled.div`
  padding: 15px;
  margin: 10px 0;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FileList = () => {
  const [files, setFiles] = useState([]);

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedFiles = localStorage.getItem('ppassFiles');
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    }
  }, []);

  // 保存数据到 localStorage
  useEffect(() => {
    localStorage.setItem('ppassFiles', JSON.stringify(files));
  }, [files]);

  return (
    <ListContainer>
      <Container>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>最近文件</h2>
        {files.length > 0 ? (
          files.map((file, index) => (
            <ListItem key={index}>
              <span>{file.name}</span>
              <span>{new Date(file.date).toLocaleDateString()}</span>
            </ListItem>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>暂无文件记录</p>
        )}
      </Container>
    </ListContainer>
  );
};

export default FileList;