import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Hero = styled.div`
  text-align: center;
  padding: 100px 0;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  color: white;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 40px;
`;

const DownloadButton = styled.a`
  display: inline-block;
  padding: 15px 30px;
  background: #fff;
  color: #6e8efb;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 0;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 40px;
`;

const Feature = styled.div`
  text-align: center;
  padding: 30px;
`;

const HomePage = () => {
  return (
    <div>
      <Hero>
        <Container>
          <Title>P-Pass File</Title>
          <Subtitle>基于 WebRTC 的个人远程文件管理工具</Subtitle>
          <DownloadButton href="#download">立即下载</DownloadButton>
        </Container>
      </Hero>

      <FeaturesSection>
        <Container>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>产品特性</h2>
          <FeatureGrid>
            <Feature>
              <h3>简易使用</h3>
              <p>无需公网 IP、内网穿透或代理服务器</p>
              <p>安装即用，无需复杂配置</p>
              <p>支持各类设备，无需额外硬件</p>
            </Feature>
            
            <Feature>
              <h3>安全可靠</h3>
              <p>点对点传输</p>
              <p>无中间服务器</p>
              <p>数据完全自主掌控</p>
            </Feature>
            
            <Feature>
              <h3>极速传输</h3>
              <p>基于 WebRTC 技术</p>
              <p>充分利用带宽资源</p>
              <p>快速稳定的文件传输</p>
            </Feature>
          </FeatureGrid>
        </Container>
      </FeaturesSection>

      <section id="download" style={{ padding: '80px 0', background: '#f5f5f5' }}>
        <Container>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>下载</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <DownloadButton 
              href="https://github.com/hawkeye-xb/P-Pass-File/releases/download/v0.1.0-alpha/P-Pass.File.Setup.1.0.0.exe"
              target="_blank"
              rel="noopener noreferrer"
            >
              Windows 版本
            </DownloadButton>
            <DownloadButton 
              href="https://github.com/hawkeye-xb/P-Pass-File/releases/download/v0.1.0-alpha/P-Pass.File-1.0.0-arm64.dmg"
              target="_blank"
              rel="noopener noreferrer"
            >
              MacOS 版本 (ARM64)
            </DownloadButton>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;