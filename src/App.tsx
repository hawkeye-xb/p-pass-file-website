import React, { useState, useEffect } from 'react';
import { FiDownload, FiCpu, FiHardDrive, FiMonitor, FiChevronDown, FiLoader } from 'react-icons/fi';

interface Release {
  platform: string;
  arch: string;
  size: string;
  url: string;
}

function App() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 添加 loading 状态
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    fetch('https://grps.hawkeye-xb.xyz/github-proxy/release/77b83f43-9530-456b-bf92-e7fcdf126f78')
      .then(res => res.json())
      .then(data => {
        if (data?.latestRelease?.assets) {
          const mappedReleases = data.latestRelease.assets
          .filter((asset: any) => !asset.name.toLowerCase().includes('blockmap'))
          .map((asset: any) => {
            let platform = 'unknown';
            let arch = 'unknown';
            
            if (asset.name.toLowerCase().includes('.dmg')) {
              platform = 'macOS';
              arch = asset.name.toLowerCase().includes('arm64') ? 'ARM64' : 'x64';
            } else if (asset.name.toLowerCase().includes('.exe')) {
              platform = 'Windows';
              arch = 'x64';
            }

            return {
              platform,
              arch,
              size: (asset.size / (1024 * 1024)).toFixed(2), // Convert bytes to MB
              url: asset.browser_download_url
            };
          }).filter((release: Release) => release.platform !== 'unknown');

          setReleases(mappedReleases);
          if (mappedReleases.length === 0) {
            setError('No compatible releases found');
          }
        } else {
          setReleases([]);
          setError('No release data available');
        }
      })
      .catch(error => {
        console.error('Error fetching releases:', error);
        setError('Failed to fetch release data');
        setReleases([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const systemRequirements = {
    Windows: [
      { icon: <FiMonitor />, label: '操作系统', value: 'Windows 10 (1809) 或更高版本' },
      { icon: <FiCpu />, label: '处理器', value: 'Intel Core i5 或同等配置' },
      { icon: <FiHardDrive />, label: '内存', value: '至少 2GB 可用空间' },
      { icon: <FiMonitor />, label: '显卡', value: '支持 DirectX 11' },
    ],
    macOS: [
      { icon: <FiMonitor />, label: '操作系统', value: 'macOS 10.13 或更高版本' },
      { icon: <FiCpu />, label: '处理器', value: 'Intel 或 Apple Silicon' },
      { icon: <FiHardDrive />, label: '内存', value: '至少 2GB 可用空间' },
    ],
    Linux: [
      { icon: <FiMonitor />, label: '操作系统', value: 'Ubuntu 18.04 或其他主流发行版' },
      { icon: <FiCpu />, label: '处理器', value: 'Intel Core i5 或同等配置' },
      { icon: <FiHardDrive />, label: '内存', value: '至少 2GB 可用空间' },
      { icon: <FiMonitor />, label: '显卡', value: '支持 OpenGL 2.0' },
    ]
  };

  const getPlatformReleases = (platform: string) => {
    if (!Array.isArray(releases)) return [];
    return releases.filter(release => release.platform.toLowerCase() === platform.toLowerCase());
  };

  const formatSize = (size: string) => {
    return parseFloat(size).toFixed(1) + ' MB';
  };

  const getProxiedDownloadUrl = (originalUrl: string) => {
    // For GitHub release assets, we should use a different jsDelivr URL format
    // Instead of cdn.jsdelivr.net/gh/, we should use cdn.jsdelivr.net/gh/username/repo@version/
    const urlParts = originalUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const repoIndex = urlParts.indexOf('github.com');
    
    if (repoIndex === -1) return originalUrl;
    
    // Use ghproxy.com as a more reliable alternative for GitHub release assets
    return `https://ghfast.top/${originalUrl}`;
  };

  const renderDownloadButton = (platform: string) => {
    return (<div key={platform}>
      { renderDownloadButtonRender(platform) }
    </div>)
  }
  const renderDownloadButtonRender = (platform: string) => {
    const platformReleases = getPlatformReleases(platform);
    
    if (isLoading) {
      return (
        <button
          disabled
          className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold opacity-75 cursor-not-allowed"
        >
          <FiLoader className="mr-2 animate-spin" />
          加载中...
        </button>
      );
    }

    if (platformReleases.length === 0) {
      return null;
    }

    if (platformReleases.length === 1) {
      return (
        <a
          href={getProxiedDownloadUrl(platformReleases[0].url)}
          className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
        >
          <FiDownload className="mr-2" />
          Download for {platform} ({platformReleases[0].arch})
          <span className="ml-2 text-sm opacity-75">({formatSize(platformReleases[0].size)})</span>
        </a>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === platform ? null : platform)}
          className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
        >
          <FiDownload className="mr-2" />
          Download for {platform}
          <FiChevronDown className="ml-2" />
        </button>
        {openDropdown === platform && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden">
            {platformReleases.map((release, index) => (
              <a
                key={index}
                href={getProxiedDownloadUrl(release.url)}
                className="block px-6 py-3 hover:bg-gray-50 text-blue-600"
              >
                {release.arch}
                <span className="ml-2 text-sm opacity-75">({formatSize(release.size)})</span>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  const productFeatures = [
    {
      title: '简易使用',
      features: [
        '无需公网 IP、内网穿透或代理服务器',
        '安装即用，无需复杂配置',
        '支持各类设备，无需额外硬件'
      ]
    },
    {
      title: '安全可靠',
      features: [
        '点对点传输',
        '无中间服务器',
        '数据完全自主掌控'
      ]
    },
    {
      title: '极速传输',
      features: [
        '基于 WebRTC 技术',
        '充分利用带宽资源',
        '快速稳定的文件传输'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Beta Notice */}
      <div className="bg-yellow-50 border-b border-yellow-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center text-yellow-800">
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-yellow-100 rounded-full mr-2">内测中</span>
            <p className="text-sm">
              目前产品处于内测阶段，如遇问题请
              <a href="https://github.com/hawkeye-xb/P-Pass-File/issues" 
                 className="underline hover:text-yellow-900 mx-1" 
                 target="_blank" 
                 rel="noopener noreferrer">
                反馈给我们
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">下载 P-Pass File</h1>
          <p className="text-xl opacity-90 mb-8">
            快速、安全、简单的跨设备文件传输工具
          </p>
          {error ? (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-white px-4 py-2 rounded">
              {error === 'No compatible releases found' ? '没有找到兼容的版本' :
               error === 'No release data available' ? '没有可用的发布版本' :
               error === 'Failed to fetch release data' ? '获取发布数据失败' :
               error}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {['Windows', 'macOS', 'Linux'].map((platform) => renderDownloadButton(platform))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Product Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">产品特性</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {productFeatures.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-600">{section.title}</h3>
                <ul className="space-y-3">
                  {section.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* System Requirements */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">系统要求</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(systemRequirements).map(([platform, requirements]) => (
              <div key={platform} className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-600">{platform}</h3>
                <div className="space-y-3">
                  {requirements.map((req) => (
                    <div key={req.label} className="flex items-start space-x-3">
                      <div className="text-blue-600 text-lg mt-1">{req.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{req.label}</h4>
                        <p className="text-gray-600 text-sm">{req.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Guide */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">使用指南</h2>
          <div className="flex flex-col space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Storage Device */}
              <div className="border border-blue-100 rounded-lg p-6 bg-blue-50">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">存储端设置</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">1</span>
                    <p className="text-gray-700">启动应用后选择"存储端"模式</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">2</span>
                    <div>
                      <p className="text-gray-700">记录自动生成的设备ID</p>
                      <p className="text-sm text-gray-500 mt-1">稍后需要提供给使用端</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">3</span>
                    <div>
                      <p className="text-gray-700">添加要共享的目录</p>
                      <p className="text-sm text-gray-500 mt-1">可以添加多个目录进行共享</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Device */}
              <div className="border border-green-100 rounded-lg p-6 bg-green-50">
                <h3 className="text-xl font-semibold text-green-700 mb-4">使用端连接</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">1</span>
                    <p className="text-gray-700">在另一台设备上启动应用并选择"使用端"模式</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">2</span>
                    <div>
                      <p className="text-gray-700">输入存储端的设备ID</p>
                      <p className="text-sm text-gray-500 mt-1">确保两台设备都在线</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">3</span>
                    <p className="text-gray-700">连接成功后即可访问共享文件</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">两台设备保持在线即可随时进行文件管理和传输</p>
              <p className="text-sm text-gray-500 mt-2">支持局域网和互联网环境下的连接</p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-gray-600">
            <div className="flex items-center space-x-4">
              <a href="https://github.com/hawkeye-xb/P-Pass-File"
                 className="hover:text-blue-600 transition-colors"
                 target="_blank"
                 rel="noopener noreferrer">
                GitHub 项目地址
              </a>
              <span>•</span>
              <a href="https://github.com/hawkeye-xb/P-Pass-File/issues"
                 className="hover:text-blue-600 transition-colors"
                 target="_blank"
                 rel="noopener noreferrer">
                问题反馈
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;