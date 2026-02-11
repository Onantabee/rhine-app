package com.tskmgmnt.rhine.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PerformanceAspectTest {

    @InjectMocks
    private PerformanceAspect performanceAspect;

    @Mock
    private ProceedingJoinPoint joinPoint;

    @Mock
    private Signature signature;

    @Mock
    private Logger log;

    @BeforeEach
    public void setUp() {
        when(joinPoint.getSignature()).thenReturn(signature);
        when(signature.getDeclaringTypeName()).thenReturn("com.tskmgmnt.rhine.service.TestService");
        when(signature.getName()).thenReturn("testMethod");
    }

    @Test
    void testMeasureExecutionTime() throws Throwable {
        when(joinPoint.proceed()).thenReturn("Result");
        
        performanceAspect.measureExecutionTime(joinPoint);

        verify(joinPoint, times(1)).proceed();
    }
}
