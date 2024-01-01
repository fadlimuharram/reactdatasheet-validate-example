export default function handler(req, res) {
  
  const provider = req.query.provider

  if(provider === 'provider1'){
    res.status(200).json({
      lists: [
        { value: "IP-450-1", label: "IP-450-1" },
        { value: "IP-480-1", label: "IP-480-1" },
        { value: "IP-500-1", label: "IP-500-1" },
      ],
    });  
  }

  if(provider === 'provider2'){
    res.status(200).json({
      lists: [
        { value: "IP-450-2", label: "IP-450-2" },
        { value: "IP-480-2", label: "IP-480-2" },
        { value: "IP-500-2", label: "IP-500-2" },
      ],
    });  
  }

  if(provider === 'provider3'){
    res.status(200).json({
      lists: [
        { value: "IP-450-3", label: "IP-450-3" },
        { value: "IP-480-3", label: "IP-480-3" },
        { value: "IP-500-3", label: "IP-500-3" },
      ],
    });  
  }

  res.status(200).json({
    lists: [
      { value: "provider1", label: "Provider 1" },
      { value: "provider2", label: "Provider 2" },
      { value: "provider3", label: "Provider 3" },
      { value: "provider4", label: "Provider 4" },
    ],
  });
}
