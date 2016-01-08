<?php

namespace spec\AppBundle\Provider;

use AppBundle\Entity\Computation;
use AppBundle\Repository\ComputationRepository;
use Doctrine\ORM\EntityManagerInterface;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

/**
 * Class ComputationProviderSpec
 * @package spec\AppBundle\Provider
 */
class ComputationProviderSpec extends ObjectBehavior
{

    function let(
        EntityManagerInterface $entityManagerInterface,
        ComputationRepository $computationRepository
    )
    {
        $entityManagerInterface->getRepository('AppBundle:Computation')
            ->willReturn($computationRepository)
        ;
        $this->beConstructedWith($entityManagerInterface);
    }

    function it_is_initializable()
    {
        $this->shouldHaveType('AppBundle\Provider\ComputationProvider');
    }

    function it_should_return_a_new_computation()
    {
        /** @var Computation $computation */
        $computation = $this->createComputation();

        $computation->shouldBeAnInstanceOf('AppBundle\Entity\Computation');

        $now = new \DateTime();
        $computationTimestamp = $computation->getTimestamp()->getWrappedObject();
        $difference = $now->diff($computationTimestamp, true);
        if ($difference->s > 1) {
            throw new \Exception("Timestamp inaccurate or incorrect");
        }
    }

    function it_should_return_the_computation_given_by_a_hashId_and_put_it_into_redis(
        ComputationRepository $computationRepository,
        Computation $computation
    )
    {
        $computationRepository->findOneBy([
            "hashId" => "Xde3gv"
        ])
            ->willReturn($computation)
        ;

        // TODO: Add Redis part of test

        $this->findComputationByHashId("Xde3gv")
            ->shouldReturn($computation)
        ;
    }

    function it_should_throw_a_not_found_exception_for_an_incorrect_hashId(
        ComputationRepository $computationRepository
    )
    {
        $computationRepository->findOneBy([
            "hashId" => "abcdef"
        ])
            ->willReturn(null)
        ;

        $this
            ->shouldThrow('Symfony\Component\HttpKernel\Exception\NotFoundHttpException')
            ->duringFindComputationByHashId("abcdef")
        ;
    }
}
