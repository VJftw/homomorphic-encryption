<?php

namespace spec\AppBundle\Controller;

use AppBundle\Entity\Computation;
use AppBundle\Finisher\ComputationFinisher;
use AppBundle\Manager\ComputationManager;
use AppBundle\Resolver\ComputationResolver;
use FOS\RestBundle\Request\ParamFetcher;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Class ComputationsControllerSpec
 * @package spec\AppBundle\Controller
 */
class ComputationsControllerSpec extends ObjectBehavior
{

    function let(
        ValidatorInterface $validator,
        ComputationResolver $computationResolver,
        ComputationFinisher $computationFinisher,
        ComputationManager $computationManager,
        RequestStack $requestStack
    ) {
        $this->beConstructedWith(
            $validator,
            $computationResolver,
            $computationFinisher,
            $computationManager,
            $requestStack
        );
    }

    function it_is_initializable()
    {
        $this->shouldHaveType('AppBundle\Controller\ComputationsController');
    }

    function it_should_conduct_a_successful_POST_request(
        ValidatorInterface $validator,
        ComputationResolver $computationResolver,
        ComputationFinisher $computationFinisher,
        ComputationManager $computationManager,
        RequestStack $requestStack,
        Request $request,
        ParamFetcher $paramFetcher,
        Computation $computation
    ) {
        $params = [];
        $paramFetcher->all()
            ->shouldBeCalled()
            ->willReturn($params)
        ;

        $request->getClientIp()
            ->shouldBeCalled()
            ->willReturn("134.231.234.222")
        ;

        $requestStack->getCurrentRequest()
            ->shouldBeCalled()
            ->willReturn($request)
        ;

        $computationResolver->fromArrayAndIpAddress($params, "134.231.234.222")
            ->shouldBeCalled()
            ->willReturn($computation)
        ;

        $validator->validate($computation)
            ->shouldBeCalled()
            ->willReturn([])
        ;

        $computationFinisher->finishComputation($computation)
            ->shouldBeCalled()
            ->willReturn($computation)
        ;

        $computationManager->save($computation)
            ->shouldBeCalled()
            ->willReturn($computation)
        ;

        $this->postComputationsAction($paramFetcher)
            ->shouldReturn($computation)
        ;
    }

    function it_should_throw_an_exception_on_an_invalid_POST_request(
        ValidatorInterface $validator,
        ComputationResolver $computationResolver,
        ComputationFinisher $computationFinisher,
        ComputationManager $computationManager,
        RequestStack $requestStack,
        Request $request,
        ParamFetcher $paramFetcher,
        Computation $computation
    ) {
        $params = [];
        $paramFetcher->all()
            ->shouldBeCalled()
            ->willReturn($params)
        ;

        $request->getClientIp()
            ->shouldBeCalled()
            ->willReturn("134.231.234.222")
        ;

        $requestStack->getCurrentRequest()
            ->shouldBeCalled()
            ->willReturn($request)
        ;

        $computationResolver->fromArrayAndIpAddress($params, "134.231.234.222")
            ->shouldBeCalled()
            ->willReturn($computation)
        ;

        $validator->validate($computation)
            ->shouldBeCalled()
            ->willReturn(['validation failed'])
        ;

        $computationFinisher->finishComputation($computation)
            ->shouldNotBeCalled()
        ;

        $computationManager->save($computation)
            ->shouldNotBeCalled()
        ;

        $this->shouldThrow('Symfony\Component\HttpKernel\Exception\BadRequestHttpException')
            ->duringPostComputationsAction($paramFetcher)
        ;
    }
}
