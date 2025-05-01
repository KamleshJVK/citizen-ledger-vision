
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Demand, Transaction } from '@/types';
import { toast } from 'sonner';

// Type for event callbacks
type DataChangeHandler<T> = (item: T) => void;

export function useDataSync() {
  // State to track subscriptions
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Set up realtime subscriptions when the hook is initialized
  useEffect(() => {
    if (isSubscribed) return;

    // Set up subscriptions to different tables
    const userSubscription = supabase
      .channel('users-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'users' 
      }, (payload) => {
        console.log('User change received:', payload);
        
        if (payload.eventType === 'INSERT') {
          toast.success('New user registered');
        } else if (payload.eventType === 'UPDATE') {
          toast.info('User information updated');
        } else if (payload.eventType === 'DELETE') {
          toast.info('User removed from system');
        }
        
        // Trigger update across components
        window.dispatchEvent(new CustomEvent('users-updated', { detail: payload }));
      })
      .subscribe();

    const demandsSubscription = supabase
      .channel('demands-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'demands' 
      }, (payload) => {
        console.log('Demand change received:', payload);
        
        if (payload.eventType === 'INSERT') {
          toast.success('New demand submitted');
        } else if (payload.eventType === 'UPDATE') {
          toast.info('Demand status updated');
        }
        
        // Trigger update across components
        window.dispatchEvent(new CustomEvent('demands-updated', { detail: payload }));
      })
      .subscribe();

    const transactionsSubscription = supabase
      .channel('transactions-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'transactions' 
      }, (payload) => {
        console.log('Transaction change received:', payload);
        
        if (payload.eventType === 'INSERT') {
          toast.success('New blockchain transaction recorded');
        }
        
        // Trigger update across components
        window.dispatchEvent(new CustomEvent('transactions-updated', { detail: payload }));
      })
      .subscribe();

    setIsSubscribed(true);

    // Cleanup subscriptions when the component unmounts
    return () => {
      userSubscription.unsubscribe();
      demandsSubscription.unsubscribe();
      transactionsSubscription.unsubscribe();
      setIsSubscribed(false);
    };
  }, [isSubscribed]);

  // Function to register listeners for specific data changes
  const registerDataChangeListener = <T>(eventName: string, handler: DataChangeHandler<T>) => {
    const listener = (event: CustomEvent) => {
      handler(event.detail.new as T);
    };

    window.addEventListener(eventName, listener as EventListener);
    return () => {
      window.removeEventListener(eventName, listener as EventListener);
    };
  };

  // Functions to register specific event type listeners
  const onUserChange = (handler: DataChangeHandler<User>) => {
    return registerDataChangeListener<User>('users-updated', handler);
  };

  const onDemandChange = (handler: DataChangeHandler<Demand>) => {
    return registerDataChangeListener<Demand>('demands-updated', handler);
  };

  const onTransactionChange = (handler: DataChangeHandler<Transaction>) => {
    return registerDataChangeListener<Transaction>('transactions-updated', handler);
  };

  return {
    onUserChange,
    onDemandChange,
    onTransactionChange
  };
}
