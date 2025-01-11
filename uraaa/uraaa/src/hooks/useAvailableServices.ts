import { useEffect, useState } from 'react';
import { ApiKey } from '../types/database';
import { apiKeyService } from '../lib/apiKeys';

export function useAvailableServices() {
  const [availableServices, setAvailableServices] = useState<Set<ApiKey['service']>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      const keys = await apiKeyService.getApiKeys();
      setAvailableServices(new Set(keys.map(k => k.service)));
      setLoading(false);
    };
    loadServices();
  }, []);

  return { availableServices, loading };
}