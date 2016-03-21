<?php

namespace spec\AppBundle\Manager;

use AppBundle\Entity\Computation;
use AppBundle\Service\RedisService;
use Doctrine\ORM\EntityManagerInterface;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

/**
 * Class ComputationManagerSpec
 * @package spec\AppBundle\Manager
 */
class ComputationManagerSpec extends ObjectBehavior
{
    function let(
        EntityManagerInterface $entityManager,
        RedisService $redisService
    )
    {
        $this->beConstructedWith($entityManager, $redisService);
    }

    function it_is_initializable()
    {
        $this->shouldHaveType('AppBundle\Manager\ComputationManager');
    }

    function it_should_save_a_computation_and_add_to_cache(
        EntityManagerInterface $entityManager,
        RedisService $redisService,
        Computation $computation
    )
    {
        $entityManager->persist($computation)
            ->shouldBeCalled()
        ;

        $entityManager->flush()
            ->shouldBeCalled()
        ;

        $redisService->provideKeyForComputation($computation)
            ->shouldBeCalled()
            ->willReturn("computation:abcde")
        ;

        $computation->getAuthToken()
            ->shouldBeCalled()
            ->willReturn("zxcvb")
        ;

        $redisService->set(
            "computation:abcde",
            "zxcvb"
        )
            ->shouldBeCalled()
        ;

        $this->save($computation)
            ->shouldReturn($computation)
        ;
    }
}
